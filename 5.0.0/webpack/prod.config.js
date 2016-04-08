// Webpack config for creating the production bundle.
var path = require('path')
var webpack = require('webpack')
var CleanPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var strip = require('strip-loader')

var relativeAssetsPath = '../dist'
var assetsPath = path.join(__dirname, relativeAssetsPath)

module.exports = {
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    'main': [
      './src/index.js'
    ]
  },
  output: {
    path: assetsPath,
    filename: 'bundle.js',
    publicPath: '/lib/'
  },
  module: {
    loaders: [
      {test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: {limit: 40960}},
      {test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap')},
      {test: /\.js$/, exclude: /node_modules/, loaders: [strip.loader('debug'), 'babel']},
      {test: /\.json$/, loader: 'json-loader'},
      {test: /\.md/, loaders: ["html-loader", "markdown-loader"]}
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.json', '.js']
  },
  plugins: [
    new CleanPlugin([relativeAssetsPath]),

    // css files from the extract-text-plugin loader
    new ExtractTextPlugin('bundle.css', {allChunks: true}),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/),

    // set global vars
    new webpack.DefinePlugin({
      'process.env': {
        // Useful to reduce the size of client-side libraries, e.g. react
        NODE_ENV: JSON.stringify('production')
      }
    }),

    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  ]
}
