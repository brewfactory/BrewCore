'use strict';

angular.module('brewpiApp')
  .controller('MainCtrl', function ($scope, socket, BrewService, ActualBrewService) {

    $scope.phasesDuration = 0;

    var
      now = new Date(),
      updatePhasesDuration;

    updatePhasesDuration = function () {
      $scope.phasesDuration = 0;
      angular.forEach($scope.actualBrew.phases, function (phase) {
        $scope.phasesDuration += +phase.min;
      });
    };

    // scope model
    $scope.temp = {
      value: 0
    };

    $scope.pwm = {
      value: 0,
      actual: 0
    };

    // set pwm
    $scope.setPwm = function () {
      if (isNaN($scope.pwm.value)) {
        return;
      }

      // set value
      socket.emit('pwm:set:manual', {
        pwm: $scope.pwm.value
      });

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
      startTime: new Date(),
      phases: []
    };

    // start hour changed
    $scope.$watch('brew.startHour', function changed(value) {
      var hour = value.split(':')[0],
        min = value.split(':')[1];

      $scope.brew.startTime.setHours(hour);
      $scope.brew.startTime.setMinutes(min);
      $scope.brew.startTime.setSeconds(0);
      $scope.brew.startTime.setMilliseconds(0);

    });


    // synchronize
    $scope.synchronize = function synchronize() {
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

    // remove phase
    $scope.removePhase = function removePhase(key) {
      $scope.brew.phases.splice(key, 1);
    };

    // add phase
    $scope.addPhase = function addPhase() {

      $scope.brew.phases.push({
        min: parseInt($scope.newPhase.min, 10),
        temp: parseInt($scope.newPhase.temp, 10)
      });

      $scope.newPhase.min = 0;
      $scope.newPhase.temp = 0;

    };

    socket.on('status', function (data) {
      $scope.temp.value = data.temp;
      $scope.pwm.actual = data.pwm * 100;
    });


    // phase ended
    socket.on('phase:changed', function (data) {
      if (data && data.status === 'ended') {
        ($scope.phaseChanged || angular.noop)();
      }
    });


    // actual brew
    $scope.actualBrew = null;
    setTimeout(function () {
      $scope.actualBrew = ActualBrewService.getActual();

      updatePhasesDuration();
    }, 10);

    ActualBrewService.onUpdate($scope, function update(actualBrew) {
      $scope.actualBrew = actualBrew;

      updatePhasesDuration();
    });

    // brew
    $scope.actualBrew = ActualBrewService;

    // stop
    $scope.stop = function stop() {
      BrewService.stop();
    };

    // pause
    $scope.pause = function pause() {
      BrewService.pause();
    };

  });
