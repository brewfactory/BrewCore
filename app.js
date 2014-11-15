/**
 * Application root
 *
 * @module app
 **/

'use strict';

// JSX support for React
require('node-jsx').install({ extension: '.jsx' });

var pkg = require('./package.json');

var koa = require('koa');
var serve = require('koa-static');
var router = require('koa-router');
var etag = require('koa-etag');
var body = require('koa-parse-json');
var cors = require('koa-cors');
var render = require('koa-ejs');

var thunkify = require('thunkify-wrap');
var nconf = require('nconf');
var mongoose = require('mongoose');

var path = require('path');

var Logger = require('./server/module/Logger');

var Socket = require('./server/module/Socket');
var routeHelper = require('./server/module/routeHelper');

var BrewUI = require('brew-ui');
BrewUI.isomorphic();

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
CLIENT = process.env.CLIENT_DIR || BrewUI.getStaticPath();

/**
 * Configuring middleware
 */

render(app, {
  root: CLIENT,
  layout: 'layout',
  viewExt: 'html'
});

app.use(cors({
  methods: ['GET', 'PUT', 'POST', 'PATCH']
}));
require('koa-qs')(app);
app.use(etag());
app.use(body());
app.use(router(app));

Logger.init();

app.use(serve(CLIENT));


// Register fetchers
BrewUI.Fetcher.register('brew', require('./server/fetcher/brew'));
BrewUI.Fetcher.register('log', require('./server/fetcher/log'));

/* *
 * React page middleware
 */

app.use(function *() {

  // Is react route?
  if (!routeHelper.isReactRoute(BrewUI.routes, { path: this.path, method: this.method })) {
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

  app.get('/api', function *(next) {
    yield next;
    this.body = {name: pkg.name, version: pkg.version};
  });

  app.get('/api/brew', brew.get);
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

server = require('http').Server(app.callback());
server.listen(PORT, function () {
  Logger.info('Server is listening on ' + PORT, 'app', {
    name: pkg.name,
    version: pkg.version
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
