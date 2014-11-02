var _ = require('lodash');


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

exports.isReactRoute = isReactRoute;
