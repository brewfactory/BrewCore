/*
 * Main controller
 *
 * @controller MainCtrl
 */

angular.module('brewpiApp')
  .controller('MainCtrl', function ($scope, $log, socket, BrewService, ActualBrewService) {
    'use strict';

    var now = new Date();


    /*
     * Scope model
     *
     */

    $scope.phasesDuration = 0;
    $scope.actualBrew = null;

    // scope model
    $scope.temp = {
      value: 0
    };

    // pwm
    $scope.pwm = {
      actual: 0
    };

    // new phase
    $scope.newPhase = {
      min: 0,
      temp: 0
    };

    // brew
    $scope.brew = {
      name: null,
      startHour: now.getHours() + ':' + now.getMinutes(),
      startTime: now,
      phases: []
    };


    /*
     * Scope watch
     *
     */
    $scope.$watch('brew.startHour', function changed(value) {
      var hour = value.split(':')[0];
      var min = value.split(':')[1];

      $scope.brew.startTime.setHours(hour);
      $scope.brew.startTime.setMinutes(min);
      $scope.brew.startTime.setSeconds(0);
      $scope.brew.startTime.setMilliseconds(0);

    });


    /*
     * Update phase duration
     *
     */
    function updatePhasesDuration () {
      $scope.phasesDuration = 0;

      angular.forEach($scope.actualBrew.phases, function (phase) {
        $scope.phasesDuration += +phase.min;
      });
    }


    /*
     * Synchronize
     *
     * @method synchronize
     */
    $scope.synchronize = function () {
      var phases = [];

      angular.forEach($scope.brew.phases, function eachPhase(phase) {
        phases.push({
          min: phase.min,
          temp: phase.temp
        });
      });

      BrewService.save({
        name: $scope.brew.name,
        startTime: $scope.brew.startTime,
        phases: phases
      });

    };


    /*
     * Remove phase
     *
     * @method removePhase
     * @param {Number} key
     */
    $scope.removePhase = function (idx) {
      $scope.brew.phases.splice(idx, 1);
    };


    /*
     * Add phase
     *
     * @method addPhase
     */
    $scope.addPhase = function () {
      var min = parseInt($scope.newPhase.min, 10);
      var temp = parseInt($scope.newPhase.temp, 10);

      $scope.brew.phases.push({
        min: min,
        temp: temp
      });

      $scope.newPhase.min = 0;
      $scope.newPhase.temp = 0;

    };


    /*
     * Brew update handle
     *
     * @method brewUpdateHandle
     * @param {Object} brew
     */
    function brewUpdateHandle (brew) {
      $scope.actualBrew = brew;
      updatePhasesDuration();
    }


    /*
     * Stop
     *
     * @method stop
     */
    $scope.stop = function () {
      BrewService.stop();
    };


    /*
     * Pause
     *
     * @method pause
     */
    $scope.pause = function () {
      BrewService.pause();
    };


    /*
     * Socket
     *
     */

    // Temperature changed
    socket.on('temperature:changed', function (data) {
      $scope.temp.value = data;
    });


    // PWM changed
    socket.on('pwm:changed', function (data) {
      $scope.pwm.actual = data;
    });


    // Phase ended
    socket.on('brew:phase', function (data) {
      if (data && data.status === 'ended') {
        ($scope.phaseChanged || angular.noop)();
      }
    });

    // Brew changed
    socket.on('brew:changed', brewUpdateHandle);


    /*
     * Initialize
     *
     * @method init
     */
    function init () {

      // Get actual brew
      ActualBrewService.getActual(brewUpdateHandle);
    }

    // Initialize
    init();

  });
