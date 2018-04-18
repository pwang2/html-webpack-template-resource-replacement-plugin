const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const cheerio = require('cheerio')

const md5 = (data) => crypto.createHash('md5').update(data).digest('hex')

module.exports = class PrecompileHandlebarsWebpackPlugin {
  constructor() { }

  apply(compiler) {
    compiler.hooks.compilation.tap('HtmlWebpackTemplateResourceReplacement', (compilation) => {
      compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync(
        'HtmlWebpackTemplateResourceReplacement',
        (data, cb) => {
          const htmlPath = data.plugin.options.template.split('!')[1]
          const source = data.html
          const $ = cheerio.load(source)
          $('[src]').each((index, el) => {
            const absPath = path.resolve(path.dirname(htmlPath), el.attribs.src)
            if (fs.existsSync(absPath)) {
              const resourceSource = fs.readFileSync(absPath)
              const chunkhash = md5(resourceSource)
              const ext = path.extname(absPath).substr(1)
              const name = path.basename(absPath, `.${ext}`)
              const segments = { chunkhash, ext, name }
              const { publicPath } = compilation.options.output
              const compilerEmitFileName = compilation.options.output.filename
              let filename= `${path.basename(compilerEmitFileName, '.js')}.${ext}`

              Object.entries(segments).forEach(([k, v]) => {
                filename = filename.replace(`[${k}]`, v)
              })

              $(el).attr('src', path.join(publicPath, filename))

              // add to emit file
              compilation.assets[filename] = {
                source: () => resourceSource,
                size: () => resourceSource.length
              }

              data.html = $('body')
                .html()
                .replace(/\{\{\s*&gt;/, '{{>') // restore handlebar partial syntax
            }
          })
          cb()
        }
      )
    })
  }
}
