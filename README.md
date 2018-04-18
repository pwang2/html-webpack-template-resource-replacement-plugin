## HTML Template Src Replacement Webpack Plugin

A plugin to extend html-webpack-plugin to replace the src resource in the template and emit the file accordingly using output.filename

## Install

```bash
  npm i --save-dev html-webpack-template-resource-replacement-plugin
```

```bash
  yarn add --dev  html-webpack-template-resource-replacement-plugin
```

**Need to work with html-webpack-plugin and only work with handlebars templating.**
**Not well tested to cover other edge cases**

## Usage

```js
const HtmlWebpackTemplateResourceReplacementPlugin = require("html-webpack-template-resource-replacement-plugin");

module.exports = {
  entry: "index.js",
  output: {
    path: __dirname + "/dist",
    filename: "index_bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackTemplateResourceReplacementPlugin()
  ]
};
```
