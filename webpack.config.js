var webpack = require('webpack');
var path = require('path');
var bourbon = require('node-bourbon').includePaths;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
let CircularDependencyPlugin = require('circular-dependency-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'bundle.css?[contenthash]',
  disable: process.env.NODE_ENV === 'development'
});

module.exports = {
  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://0.0.0.0:8080', // WebpackDevServer host and port
    'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
    path.join(__dirname, 'src', 'ts', 'sample', 'index.tsx'),
    path.join(__dirname, 'src', 'ts', 'sample', 'index.html')
  ],

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader?name=[name].[ext]'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: extractSass.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.join(__dirname, 'src', 'scss', 'includes'), JSON.stringify(bourbon)]
              }
            }
          ]
        })
      },
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/, /test/, /typings/],
        enforce: 'pre',
        use: [
          {
            loader: 'babel-loader'
          },
          {
            loader: 'ts-loader'
          },
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  output: {
    path: path.join(__dirname, 'wwwroot'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'wwwroot'),
    // This is for the dev server to recognize browser history routing.
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    extractSass,
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp 
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings 
      failOnError: true
    })
  ]
};
