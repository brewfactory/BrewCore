'use strict';

angular.module('brewpiApp')
  .factory('socket', function (socketFactory) {
  return socketFactory();
});
