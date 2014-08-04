/*
 * App
 *
 */

(function () {
  'use strict';

  var deps = [
    'ngResource',
    'ngRoute',

    'angles',
    'btford.socket-io',
    'mgcrea.ngStrap.helpers.dimensions',
    'mgcrea.ngStrap.helpers.dateParser',
    'mgcrea.ngStrap.tooltip',
    'mgcrea.ngStrap.timepicker',

    'Navigation',
    'Notification'
  ];

  /*
   * @name BrewCore App
   *
   * @ngInject
   */
  function AppConfig($routeProvider) {
    $routeProvider
      .when('/brew', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/log', {
        templateUrl: 'views/log.html',
        controller: 'LogCtrl'
      })
      .otherwise({
        redirectTo: '/brew'
      });
  }

  angular.module('brewpiApp', deps)
    .config(AppConfig);

}());
