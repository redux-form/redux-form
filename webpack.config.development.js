'use strict'

var webpack = require('webpack')
var baseConfig = require('./webpack.config.base')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')

var config = Object.create(baseConfig)
config.plugins = [
  new LodashModuleReplacementPlugin,
  new webpack.optimize.OccurenceOrderPlugin(),  
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('development')
  })

]

module.exports = config
