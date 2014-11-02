/**
 * Application root
 *
 * @module app
 **/

'use strict';

var pkg = require('./package.json');

var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router');
var etag = require('koa-etag');
var body = require('koa-parse-json');
var cors = require('koa-cors');
var send = require('koa-send');

var nconf = require('nconf');
var mongoose = require('mongoose');

var path = require('path');

var Logger = require('./server/module/Logger');

var Socket = require('./server/module/Socket');
var brewUI = require('brew-ui');
var routeHelper = require('./server/module/routeHelper');
var app = koa();

var server;
var PORT;
var CLIENT;


/**
 * Configuration
 */

if (process.env.NODE_ENV === 'production') {
  nconf.file(path.join(__dirname, 'config/prod.json'));
}
else if (process.env.NODE_ENV === 'test') {
  nconf.file(path.join(__dirname, 'config/test.json'));
}
else {
  nconf.file(path.join(__dirname, 'config/dev.json'));
}

mongoose.connect(process.env.MONGOHQ_URL || nconf.get('mongo:connect'));

PORT = process.env.PORT || nconf.get('port');
CLIENT = path.join(__dirname, process.env.CLIENT_DIR || 'client');


/**
 * Configuring middlewares
 */

app.use(cors({
  methods: ['GET', 'PUT', 'POST', 'PATCH']
}));
require('koa-qs')(app);
app.use(etag());
app.use(body());
app.use(router(app));

Logger.init();

app.use(serve(CLIENT));


/* *
 * React page middleware
 */

app.use(function *(next) {
  yield next;

  var routeConfig = brewUI.routes;

  // Is react route?
  if (routeHelper.isReactRoute(routeConfig, {
      path: this.path,
      method: this.method
    })) {
    yield send(this, path.join(CLIENT, 'index.html'));
  }
});


/**
 * Router
 */

{

  let brew = require('./server/route/brew');
  let log = require('./server/route/log');

  app.get('/api', function *(next) {
    yield next;
    this.body = {name: pkg.name, version: pkg.version};
  });

  app.post('/api/brew', brew.create);
  app.patch('/api/brew/stop', brew.stop);
  app.patch('/api/brew/pause', brew.pause);

// logs
  app.get('/api/brew/log', log.find);
  app.get('/api/brew/log/:id', log.findOne);
}


/**
 * Fire up the server
 */

{
  server = require('http').Server(app.callback());

  Logger.info('Start build UI');
  brewUI.build(path.join(__dirname, './client'))
    .then(function () {
      Logger.info('UI is built successfully');

      server.listen(PORT, function () {
        Logger.info('Server is listening on ' + PORT, 'app', {
          name: pkg.name,
          version: pkg.version
        });
      });
    }).catch(function (err) {
      Logger.error('UI build error', {err: err});
      process.exit(0);
    });
}


/**
 * Socket.io
 */

{
  let io = require('socket.io')(server);

  Socket.init(io);
}


/*
 * Core (brewer)
 */
{
  let core = require('./core');

  Socket.setCoreEmitter(core.emitter);

  core.init();
}
