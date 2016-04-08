'use strict'
var webpack = require('webpack')
var env = process.env.NODE_ENV

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
}

module.exports = {
  externals: {
    'react': reactExternal
  },
  module: {
    loaders: [
      {
        test: /\.js$/, loaders: [ 'babel' ],
        exclude: /node_modules/
      }
    ]
  },
  output: {
    library: 'ReduxFormWebsiteGenerator',
    libraryTarget: 'umd'
  },
  plugins: [
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
    extensions: [ '', '.js' ]
  }
}
