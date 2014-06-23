'use strict';

// TODO: refactor
angular.module('brewpiApp')
  .factory('ActualBrewService', function ($rootScope, socket) {

    var MSG_ID = 'actualBrewUpdate',

      actualBrew = {
        name: null,
        phases: [],
        startTime: null,
        paused: false
      },

    // private methods
      _onUpdate,
      _getActual;

    socket.on('actual:brew', function (_actualBrew) {
      actualBrew = _actualBrew;

      $rootScope.$broadcast(MSG_ID, actualBrew);
    });

    _onUpdate = function _onUpdate($scope, handler) {
      $scope.$on(MSG_ID, function (event, message) {
        handler(message);
      });
    };

    _getActual = function _getActual() {
      return actualBrew;
    };

    return {
      getActual: _getActual,
      onUpdate: _onUpdate
    };
  });
