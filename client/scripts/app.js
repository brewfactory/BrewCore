'use strict';

(function () {

  var
    deps = [
      'ngResource',
      'ngRoute',

      'angles',
      'btford.socket-io',

      'BSTimePicker',
      'Navigation',
      'Notification'
    ];

  angular.module('brewpiApp', deps)
    .config(function ($routeProvider) {
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
    });

}());
