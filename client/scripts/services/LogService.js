'use strict';

angular.module('brewpiApp')
  .factory('LogService', function ($resource) {

    return $resource('logs/:id/:action/', { id: '@id' }, {
      find: { method: 'POST', isArray: true },
      findBrews: { method: 'GET', isArray: true, params: { action: 'brews'} }
    });
  });
