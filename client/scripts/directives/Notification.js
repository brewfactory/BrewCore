/*global angular, $ */

angular.module('Notification', [])
  .directive('notification', [function () {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'views/notification.html',
      scope: {
        soundSource: '=',
        trigger: '=',
        title: '=',
        text: '='
      },
      link: function ($scope, element, attrs) {
        var
          playSound,
          audioElement;

        audioElement = $(element).children('audio')[0];

        $scope.sources = [];
        $scope.sources.push({ file: 'sounds/horse.mp3', type: 'audio/mpeg' });
        $scope.sources.push({ file: 'sounds/horse.ogg', type: 'audio/ogg' });

        $scope.trigger = function () {
          $scope.show = true;

          playSound();
        };

        playSound = function () {
          audioElement.play();
        };
      }
    };
  }]);