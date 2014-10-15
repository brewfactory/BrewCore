/*
 * Brew service
 *
 * @service BrewService
 */

angular.module('brewpiApp')
  .factory('BrewService', function ($resource) {
    'use strict';

    return $resource('api/brew/:id/:action/', { id: '@id' }, {
      save: { method: 'POST' },
      stop: { method: 'PATCH', params: { action: 'stop' }},
      pause: { method: 'PATCH', params: { action: 'pause' }}
    });
  });
