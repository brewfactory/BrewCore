/*
 * Route helper
 *
 * @modile routeHelper
 */

var _ = require('lodash');
var serialize = require('serialize-javascript');


/*
 * Is react route
 *
 * @method isReactRoute
 * @param {Object} routeConfig
 * @param {String} path
 * @param {String} method
 * @return {Boolean}
 */
function isReactRoute (routeConfig, _route) {

  return _.some(routeConfig, function (route) {
    return _route.path.match(new RegExp('^' + route.path + '$')) &&
      route.method.toUpperCase() === _route.method;
  });
}


/*
 * Share state
 *
 * @method shareState
 * @param {Object} application
 * @return {String}
 */
function shareState(application) {
  var state = application.context.dehydrate();
  var serializedState = serialize(state);

  return  '(function (root) {\n' +
      'root.App || (root.App = {});\n' +
      'root.App.Context = ' + serializedState +
      ';\n }(this));';
}


// Interface
exports.isReactRoute = isReactRoute;
exports.shareState = shareState;
