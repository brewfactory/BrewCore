/*
 * LogService
 *
 * @service LogService
 */

angular.module('brewpiApp')
  .factory('LogService', function ($resource) {
    'use strict';

    return $resource('api/logs/:id/:action/', { id: '@id' }, {
      find: { method: 'GET' },
      findBrews: { method: 'GET', params: { action: 'brews'} }
    });
  });
