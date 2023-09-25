import should from 'should';
import sinon from 'sinon';
import { expect } from 'chai';
import bottleController from '../controllers/bottleController.js';
import bottleModel from '../models/bottleModel.js';

// unit test for JUST post on bottleController
// TO DO: Write unit tests for all operations
describe('Bottle Controller Tests (Unit)', () => {
  describe('PostNoVintner', () => {
    it('should not allow empty vintner field on post', () => {
      const Bottle = function (bottle) { this.save = () => {}; };

      const req = {
        body: {
          varietal: 'Chardonnay',
          category: 'White'
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
  describe('PostOK', () => {
    it('should allow post if all fields are provided', () => {
      const Bottle = function (bottle) {
        this.save = () => {};
        this.toJSON = () => ({
          ...bottle
        });
      };

      const req = {
        headers: {
          host: 'localhost:3333'
        },
        body: {
          vintner: 'Test Vineyards',
          varietal: 'Chardonnay',
          category: 'White'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = bottleController(Bottle);
      controller.post(req, res);

      res.status.calledWith(201).should.equal(true, `Expected status 201 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  describe('GetOK', () => {
    it('should allow get and return', async () => {
      const testBottles = [
        {
          vintner: 'Test Winery',
          category: 'White',
          varietal: 'Chardonnay',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            vintner: 'Test Winery',
            category: 'White',
            varietal: 'Chardonnay',
            _id: '65105443bd7060ad271c1559'
          })
        }
      ];
      const stub = sinon.stub(bottleModel, 'find').returns(testBottles);
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        query: {
          vintner: 'Test Vineyards',
          varietal: 'Chardonnay',
          category: 'White'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = bottleController(bottleModel);
      const result = await controller.get(req, res);

      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
});
