'use strict';

angular.module('brewpiApp')
  .factory('LogService', function ($resource) {

    return $resource('api/logs/:id/:action/', { id: '@id' }, {
      find: { method: 'GET' },
      findBrews: { method: 'GET', params: { action: 'brews'} }
    });
  });
