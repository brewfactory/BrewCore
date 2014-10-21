/*
 * LogService
 *
 * @service LogService
 */

angular.module('brewpiApp')
  .factory('LogService', function ($resource) {
    'use strict';

    return $resource('api/brew/log/:id/', { id: '@id' }, {
      find: { method: 'GET' },
      findOne: { method: 'GET' }
    });
  });
