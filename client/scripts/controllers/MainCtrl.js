/*
 * Main controller
 *
 */

(function () {
  'use strict';

  /*
   * @name Main controller
   *
   * @ngInject
   */
  function MainCtrl ($scope, socket, BrewService, ActualBrewService) {

    $scope.form = {
      isStartTime: false
    };

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
      startTime: new Date(),
      phases: []
    };


    /*
     * @name Update phase duration
     *
     * @method updatePhasesDuration
     *
     */
    function updatePhasesDuration () {
      $scope.phasesDuration = 0;

      angular.forEach($scope.actualBrew.phases, function (phase) {
        $scope.phasesDuration += +phase.min;
      });
    }


    /*
     * @name Synchronize
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
     * @name Remove phase
     *
     * @method removePhase
     * @param {Number} key
     */
    $scope.removePhase = function (idx) {
      $scope.brew.phases.splice(idx, 1);
    };


    /*
     * @name Add phase
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
     * @name Brew update handle
     *
     * @method brewUpdateHandle
     * @param {Object} brew
     */
    function brewUpdateHandle (brew) {
      $scope.actualBrew = brew;
      updatePhasesDuration();
    }


    /*
     * @name Stop
     *
     * @method stop
     */
    $scope.stop = function () {
      BrewService.stop();
    };


    /*
     * @name Pause
     *
     * @method pause
     */
    $scope.pause = function () {
      BrewService.pause();
    };


    /*
     * name Socket
     *
     */

    // Temperature changed
    socket.on('temperature_changed', function (data) {
      $scope.temp.value = data;
    });


    // PWM changed
    socket.on('pwm_changed', function (data) {
      $scope.pwm.actual = data;
    });


    // Phase ended
    socket.on('brew_phase', function (data) {
      if (data && data.status === 'ended') {
        ($scope.phaseChanged || angular.noop)();
      }
    });

    // Brew changed
    socket.on('brew_changed', brewUpdateHandle);


    /*
     * @name Initialize
     *
     * @method init
     */
    function init () {

      // Get actual brew
      ActualBrewService.getActual(brewUpdateHandle);
    }

    // Initialize
    init();
  }


  // Attach to the app
  angular.module('brewpiApp')
    .controller('MainCtrl', MainCtrl);

} ());
