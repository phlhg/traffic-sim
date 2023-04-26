const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

function output(entry, output){
  return {
    mode: 'development',
    entry: entry,
    output: {
      filename: output,
      path: path.resolve(__dirname, 'public/js'),
    },
    devtool: 'source-map',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          parallel: true,
          extractComments: false,
          terserOptions: {
            format: { comments: false, },
            toplevel: true,
            keep_classnames: true,
            keep_fnames: true
          }
        })
      ]
    }
  }
}

module.exports = [
  output('./source/index.js', 'main.js'),
  output('./source/workers/bruteforce.js', 'workers/bruteforce.js'),
]