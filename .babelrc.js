const isEs = process.env.BABEL_ENV === 'es'

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: isEs ? false : 'commonjs',
        loose: true
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    'babel-plugin-lodash',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-transform-flow-strip-types',
    ['@babel/plugin-proposal-class-properties', { loose: true }]
  ]
}
