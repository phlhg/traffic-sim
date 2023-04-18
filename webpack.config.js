const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './source/index.js',
    output: {
      filename: 'main.js',
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
};