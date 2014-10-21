/*
 * Log controller
 *
 */

(function () {
  'use strict';

  // TODO: refactor


  /*
   * @name Log controller
   *
   * @ngInject
   */
  function LogCtrl($scope, LogService) {

    $scope.options = {};

    $scope.options.temp = {
      pointDot: true,
      bezierCurve: false,
      responsive: true,
      scaleLabel: '<%=value%>°'
    };

    $scope.options.pwm = {
      pointDot: true,
      bezierCurve: false,
      scaleOverride: true,
      scaleStartValue: 0,
      scaleSteps: 10,
      scaleStepWidth: 10,
      scaleLabel: '<%=value%>%',
      responsive: true
    };

    $scope.brews = [];
    $scope.brew = null;


    $scope.chart = {

      // temp chart
      temp: {
        labels: [],
        datasets: [
          {
            fillColor: 'rgba(37,190,223,0.1)',
            strokeColor: '#25bedf',
            pointColor: 'rgba(151,187,205,0)',
            pointStrokeColor: '#25bedf',
            data: [1]
          }
        ]
      },

      // pwm chart
      pwm: {
        labels: [],
        datasets: [
          {
            fillColor: 'rgba(225,18,71,0.1)',
            strokeColor: '#da586d',
            pointColor: 'rgba(225,18,71,0)',
            pointStrokeColor: '#da586d',
            data: [1]
          }
        ]
      }
    };


    /*
     * Plot brew
     *
     * @method plotBrew
     * @param {Array} logs
     */
    function plotBrew(logs) {
      var skip = Math.floor(logs.length / 18) + 1;
      var min = {};
      var max = {};

      var pwmDataSet = $scope.chart.pwm.datasets[0];
      var tempDataSet = $scope.chart.temp.datasets[0];

      // clear previous
      $scope.chart.temp.labels = [];
      $scope.chart.pwm.labels = [];
      pwmDataSet.data = [];
      tempDataSet.data = [];

      angular.forEach(logs, function eachLog(log, key) {
        var dateLabel;

        log.date = new Date(log.date);

        if (key % skip === 0) {
          dateLabel = log.date.getHours() + ':' + (log.date.getMinutes() < 10 ? '0' + log.date.getMinutes() : log.date.getMinutes());

          // max-min temp
          if (!min.temp || min.temp > log.temp) {
            min.temp = log.temp;
          }

          if (!max.temp || max.temp < log.temp) {
            max.temp = log.temp;
          }

          $scope.chart.temp.labels.push(dateLabel);
          tempDataSet.data.push(log.temp);

          $scope.chart.pwm.labels.push(dateLabel);
          pwmDataSet.data.push(log.pwm * 100);

        }
      });

      $scope.options.temp.scaleOverride = false;

      if (max.temp === min.temp) {
        $scope.options.temp.scaleOverride = true;
        $scope.options.temp.scaleSteps = 7;
        $scope.options.temp.scaleStepWidth = 0.5;
        $scope.options.temp.scaleStartValue = max.temp - 2;
      }
    }


    /*
     * @name Find brew
     *
     * @method findBrew
     */
    function findBrew() {
      var brew = $scope.brew;

      if (!brew || !brew._id) {
        return;
      }

      LogService.findOne({
        id: $scope.brew._id
      }, function find(resp) {
        var brews = resp.brews || {};
        var logs = brews.logs || [];

        if(logs.length) {
          plotBrew(logs);
        }
      });
    }


    /*
     * On bre changed
     *
     * @method onBrewChanged
     */
    $scope.onBrewChanged = function () {
      findBrew();
    };

    // brews
    LogService.find(function findBrews(resp) {
      $scope.brews = resp.brews;

      if ($scope.brews[0]) {
        $scope.brew = $scope.brews[0];

        findBrew();
      }
    });
  }

  // Attach to the app
  angular.module('brewpiApp')
    .controller('LogCtrl', LogCtrl);

}());
