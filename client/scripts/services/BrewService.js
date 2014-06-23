'use strict';

angular.module('brewpiApp')
  .factory('BrewService', function ($resource) {

    return $resource('brew/:id/:action/', { id: '@id' }, {
      save: { method: 'POST' },
      stop: { method: 'GET', params: { action: 'stop' }},
      pause: { method: 'GET', params: { action: 'pause' }}
    });
  });
