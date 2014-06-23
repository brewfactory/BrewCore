/**
 * Application root
 *
 * @module app
 **/

var pkg = require('./package.json');

var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router');
var etag = require('koa-etag');

var nconf = require('nconf');
var mongoose = require('mongoose');

var path = require('path');

var Logger = require('./core/module/Logger');
var Socket = require('./server/module/Socket');
var app = koa();

var io;

// Routers

var server;
var PORT;


if (process.env.NODE_ENV === 'production') {
  nconf.file(path.join(__dirname, 'config/prod.json'));
}
else if (process.env.NODE_ENV === 'test') {
  nconf.file(path.join(__dirname, 'config/test.json'));
}
else {
  nconf.file(path.join(__dirname, 'config/dev.json'));
}

mongoose.connect(nconf.get('mongo:connect'));

PORT = process.env.PORT || nconf.get('port');


/**
 * Configuring middlewares
 */

require('koa-qs')(app);
app.use(etag());
app.use(router(app));

Logger.init();
app.use(serve(process.env.CLIENT_DIR || nconf.get('client')));


/**
 * Router
 */

app.get('/api', function *(next) {
  yield next;
  this.body = { name: pkg.name, version: pkg.version };
});


/**
 * Fire up the server
 */

server = app.listen(PORT, function () {
  Logger.info('Server is listening on ' + PORT, 'app', {
    name: pkg.name,
    version: pkg.version
  });
});


/**
 * Configure socket.io
 */

io = require('socket.io').listen(server);
io.set('log level', 1);

Socket.init(io);
