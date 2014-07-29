/*
 * Temperature test
 *
 * @test Temperature
 */

var teperature = require('../../core/temperature');

describe('Temperature', function () {

  before(function () {
    teperature.init();
  });


  /*
   * Actual
   *
   */
  describe('actual', function () {

    it('should be undefined before tempInfo event', function () {
      expect(teperature.getActual()).to.be.undefined;
    });
  });


  /*
   * Point
   *
   */
  describe('point', function () {

    it('should get and be initialized with the inactive temp', function () {
      expect(teperature.getPoint()).to.be.eql(5);
    });

    it('should be set', function () {
      var point = 32.3;

      teperature.setPoint(point);

      expect(teperature.getPoint()).to.be.eql(point);
    });

    it('should be set to inactive temperature', function () {
      var point = 32.3;

      teperature.setPoint(point);
      expect(teperature.getPoint()).to.be.eql(point);

      teperature.setPointToInactive();
      expect(teperature.getPoint()).to.be.eql(5);
    });
  });

});
