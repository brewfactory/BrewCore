/*global $ */

'use strict';

angular.module('BSTimePicker', []).directive('timepicker', function () {
  return {
    restrict: 'A',
    scope: {
      value: '='
    },
    link: function (scope, element) {

      if (!scope.value) {
        scope.value = '12:45';
      }

      $(element).timepicker({
        template: 'dropdown',
        showMeridian: false
      }).on('changeTime.timepicker', function timeUpdated(ev) {
          if (!scope.$root.$$phase) {
            scope.$apply(function apply() {
              scope.value = ev.time.value;
            });
          }
        });

      $(element).timepicker('setTime', scope.value);
    }
  };
});