/**
 * Application root
 *
 * @module app
 **/

'use strict';

require('@risingstack/trace');

// JSX support for React
require('node-jsx').install({
  extension: '.jsx'
});

var config = require('./config');
var pkg = require('./package.json');

var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router')();
var body = require('koa-parse-json');
var cors = require('koa-cors');
var render = require('koa-ejs');

var thunkify = require('thunkify-wrap');
var mongoose = require('mongoose');

var Logger = require('./server/module/Logger');

var Socket = require('./server/module/Socket');
var routeHelper = require('./server/module/routeHelper');

var BrewUI = require('brew-ui');
BrewUI.isomorphic();

var app = koa();

var server;

/**
 * Configuration
 */

mongoose.connect(config.mongo.connect);

/**
 * Configuring middleware
 */

render(app, {
  root: config.clientDir,
  layout: 'layout',
  viewExt: 'html'
});

app.use(cors({
  methods: ['GET', 'PUT', 'POST', 'PATCH']
}));
app.use(body());
app.use(router.routes());

Logger.init();

app.use(serve(config.clientDir));


// Register fetchers
BrewUI.Fetcher.register('brew', require('./server/fetcher/brew'));
BrewUI.Fetcher.register('log', require('./server/fetcher/log'));

/* *
 * React page middleware
 */

app.use(function *(next) {

  // Is react route?
  if (!routeHelper.isReactRoute(BrewUI.routes, { path: this.path, method: this.method })) {
    yield next;
    return;
  }

  var application = new BrewUI.App({
    fetcher: BrewUI.Fetcher
  });
  var actionContext = application.context.getActionContext();
  var executeAction = thunkify(actionContext.executeAction);
  var renderedHtml;

  // Execute navigation action
  try {
    yield executeAction(BrewUI.actions.navigateAction, { path: this.url });
  } catch (err) {
    if(err.status === 404) {
      this.throw(404);
    }

    this.throw(500, 'Error happened.');
  }

  yield application.init();

  // React render
  renderedHtml = BrewUI.React.renderToString(application.getComponent());

  // Render layout with the application state
  yield this.render('layout', {
    html: renderedHtml,
    state: routeHelper.shareState(application)
  });
});


/**
 * Router
 */

{

  let brew = require('./server/route/brew');
  let log = require('./server/route/log');

  router.get('/api', function *(next) {
    yield next;
    this.body = {name: pkg.name, version: pkg.version};
  });

  router.get('/api/brew', brew.get);
  router.post('/api/brew', brew.create);
  router.patch('/api/brew/stop', brew.stop);
  router.patch('/api/brew/pause', brew.pause);

  // logs
  router.get('/api/brew/log', log.find);
  router.get('/api/brew/log/:id', log.findOne);
}


/**
 * Fire up the server
 */

server = require('http').Server(app.callback());
server.listen(config.port, function () {
  Logger.info('Server is listening on ' + config.port, 'app', {
    name: pkg.name,
    version: pkg.version,
    env: config.env
  });
});


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
