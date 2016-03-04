var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    index: './src/index',
    prism: './src/prism.js'
  },
  node: {
    console: true
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  plugins: [
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: [ '', '.json', '.js' ]
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: [ 'babel' ],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url',
        query: { limit: 40960 }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap')
      }
    ]
  }
};