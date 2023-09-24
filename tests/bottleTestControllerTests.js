import should from 'should';
import sinon from 'sinon';
import bottleController from '../controllers/bottleTestController.js';

// unit test for JUST post on bottleController
// TO DO: Write unit tests for all operations
describe('Bottle Controller Tests:', () => {
  describe('Post', () => {
    it('should not allow empty vintner field on post', () => {
      const Bottle = function (bottle) { this.save = () => {}; };

      const req = {
        body: {
          varietal: 'Chardonnay'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = bottleController(Bottle);
      controller.post(req, res);

      res.status.calledWith(400).should.equal(true, `Expected status 400 and got status ${res.status.args[0][0]}`);
      res.send.calledWith('missing required items in post body').should.equal(true, 'Expected message: missing required items in post body');
    });
  });
});
