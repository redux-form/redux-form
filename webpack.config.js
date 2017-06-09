'use strict';
var webpack = require('webpack');
var env = process.env.NODE_ENV;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
};

module.exports = {
  externals: {
    'react': reactExternal
  },
  entry: {
    'main': [
      './src/client.js'
    ]
  },
  module: {
    loaders: [
      {
        test: /\.js$/, loaders: [ 'babel' ],
        exclude: /node_modules/
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'url',
        query: { limit: 40960 }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=2&sourceMap&localIdentName=[local]___[hash:base64:5]!autoprefixer-loader?browsers=last 2 version!sass-loader?outputStyle=expanded&sourceMap')
      }
    ]
  },
  output: {
    library: 'ReduxFormWebsiteTemplate',
    libraryTarget: 'umd'
  },
  plugins: [
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  ],
  resolve: {
    extensions: [ '.js' ]
  }
};
