const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/build',
    publicPath: '',
    filename: 'bundle.js',
  },
  module: {
      rules: [
          {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                  loader: 'babel-loader'
              },
          },
          {
              test: /\.(html)$/,
              use: {
                  loader: 'html-loader',
              },
          },
          { test: /\.jpg$/, use: [ 'file-loader', ], },
          { test: /\.png$/, use: [ 'url-loader?mimetype=image/png',  ], },
      ],
  },
  plugins: [    
    new HtmlWebpackPlugin ({
      inject: true,
      template: './public/index.html'
    }),
  ],
  devServer: {
    contentBase: './public',
  },
};
