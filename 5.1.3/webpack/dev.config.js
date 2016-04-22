var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var assetsPath = path.resolve(__dirname, '../dist')
var host = 'localhost'
var port = 3030

var babelrc = fs.readFileSync('./.babelrc')
var babelrcObject = {}

try {
  babelrcObject = JSON.parse(babelrc)
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.')
  console.error(err)
}

module.exports = {
  devtool: 'inline-source-map',
  context: path.resolve(__dirname, '..'),
  entry: [
    'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
    './src/index.js'
  ],
  output: {
    path: assetsPath,
    filename: 'bundle.js',
    publicPath: 'http://' + host + ':' + port + '/dist/'
  },
  module: {
    loaders: [
      { test: /\.(jpe?g|png|gif|svg)$/, loader: 'url', query: { limit: 40960 } },
      {
        test: /\.scss$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [ 'babel', 'eslint' ]
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.md/, loaders: [ "html-loader", "markdown-loader" ] }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: [ '', '.json', '.js' ]
  },
  plugins: [
    // hot reload
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __DEVELOPMENT__: true,
      __DEVTOOLS__: true  // <-------- DISABLE redux-devtools HERE
    })
  ]
}
