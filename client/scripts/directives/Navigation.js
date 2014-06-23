'use strict';

angular.module('Navigation', [])
  .directive('activeLink', ['$location', function (location) {
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var clazz = attrs.activeLink,
          path = attrs.href;

        //hack because path does bot return including hashbang
        if (path) {
          path = path.substring(1);
        }

        scope.location = location;
        scope.$watch('location.path()', function (newPath) {
          if (path === newPath) {
            element.addClass(clazz);
          } else {
            element.removeClass(clazz);
          }
        });
      }
    };
  }]);