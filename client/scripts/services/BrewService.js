/*
 * Brew service
 *
 * @service BrewService
 */

angular.module('brewpiApp')
  .factory('BrewService', function ($resource) {
    'use strict';

    return $resource('brew/:id/:action/', { id: '@id' }, {
      save: { method: 'POST' },
      stop: { method: 'GET', params: { action: 'stop' }},
      pause: { method: 'GET', params: { action: 'pause' }}
    });
  });
