'use strict'
var webpack = require('webpack')
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var env = process.env.NODE_ENV

var reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react'
}

var reduxExternal = {
  root: 'Redux',
  commonjs2: 'redux',
  commonjs: 'redux',
  amd: 'redux'
}

var reactReduxExternal = {
  root: 'ReactRedux',
  commonjs2: 'react-redux',
  commonjs: 'react-redux',
  amd: 'react-redux'
}

var immutableExternal = {
  root: 'Immutable',
  commonjs2: 'immutable',
  commonjs: 'immutable',
  amd: 'immutable'
}

var config = {
  externals: {
    react: reactExternal,
    redux: reduxExternal,
    'react-redux': reactReduxExternal,
    immutable: immutableExternal
  },
  mode: 'development',
  module: {
    rules: [
      { test: /\.js$/, loaders: ['babel-loader'], exclude: /node_modules/ }
    ]
  },
  output: {
    library: 'ReduxForm',
    libraryTarget: 'umd'
  },
  plugins: [
    new LodashModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (env === 'production') {
  config.mode = 'production'
}

module.exports = config
