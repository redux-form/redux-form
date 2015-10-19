var Express = require('express');
var webpack = require('webpack');
var path = require('path');

var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var host = process.env.HOST || 'localhost';
var port = 3030;
var serverOptions = {
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  publicPath: webpackConfig.output.publicPath,
  stats: {colors: true}
};

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));
app.use(require('serve-static')(path.join(__dirname, '..')));

app.listen(port, function onAppListening(err) {
  if (err) {
    console.error(err);
  } else {
    console.info('==> 🚧  Webpack development server listening on port %s', port);
  }
});
