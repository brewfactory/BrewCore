/*
 * Socket
 *
 * @service socket
 */

angular.module('brewpiApp')
  .factory('socket', function (socketFactory) {
    'use strict';

    return socketFactory();
  });
