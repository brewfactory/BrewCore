/*
 * Actual brew service
 *
 * @service ActualBrewService
 */

// TODO: refactor
angular.module('brewpiApp')
  .factory('ActualBrewService', function ($q, socket) {
    'use strict';

    var deferred = $q.defer();
    var resolved = false;

    var actualBrew = {
        name: null,
        phases: [],
        startTime: null,
        paused: false
      };


    /*
     * Socket
     *
     */
    socket.on('brew_changed', function (_actualBrew) {
      actualBrew = _actualBrew;
      resolved = true;
      deferred.resolve(actualBrew);
    });


    /*
     * Get actual
     * @method getActual
     */
    function getActual(callback) {
      if(resolved === true) {
        return callback(actualBrew);
      }

      deferred.promise.then(callback);
    }

    return {
      getActual: getActual
    };
  });
