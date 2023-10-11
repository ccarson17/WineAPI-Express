import should from 'should';
import sinon from 'sinon';
import { expect } from 'chai';
import bottleController from '../controllers/bottleController.js';
import bottleModel from '../models/bottleModel.js';

// unit test for JUST post on bottleController
// TO DO: Write unit tests for all operations
describe('Bottle Controller Tests (Unit)', () => {
  // POST /api/v1/bottle test controller function when all required parameters NOT provided
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
  // POST /api/v1/bottle test controller function when all required parameters provided
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
  // GET /api/v1/bottle test controller function when all required parameters provided
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

      sinon.restore();
    });
  });
  // /api/v1/bottle test findById controller middleware when all required parameters provided
  describe('FindByIdOK', () => { // middleware function used for getById, put, patch and deleteBottle to find to bottle to operate on.
    it('should allow get by id and return', async () => {
      const testBottle = {
        vintner: 'Test Winery',
        category: 'White',
        varietal: 'Chardonnay',
        _id: '65105443bd7060ad271c1559'
      };

      const stub = sinon.stub(bottleModel, 'findById').returns(testBottle);

      const req = {
        params: {
          _id: '65105443bd7060ad271c1559'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const next = sinon.spy();

      const controller = bottleController(bottleModel);
      const result = await controller.findById(req, res, next);

      next.called.should.equal(true, 'next() was not called');

      sinon.restore();
    });
  });
  // /api/v1/bottle test findById controller middleware when item is not found
  describe('FindById404', () => { // middleware function used for getById, put, patch and deleteBottle to find to bottle to operate on.
    it('should return 404 error when id not found', async () => {
      const stub = sinon.stub(bottleModel, 'findById').returns(null);

      const req = {
        params: {
          _id: '65105443bd7060ad271c9999'
        }
      };

      const res = {
        sendStatus: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const next = sinon.spy();

      const controller = bottleController(bottleModel);
      const result = await controller.findById(req, res, next);

      res.sendStatus.calledWith(404).should.equal(true, `Expected status 404 and got status ${res.sendStatus.args[0][0]}`);

      sinon.restore();
    });
  });
  // GET /api/v1/bottle/:id test getById controller function when item is found
  describe('GetByIdOK', () => { // simple get by bottle id
    it('should allow get by id and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        bottle: {
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
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = bottleController(bottleModel);
      const result = await controller.getById(req, res);

      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // PUT /api/v1/bottle/:id test put controller function when item is found
  describe('PutOK', () => { // simple get by bottle id
    it('should allow get by id, update and return', async () => {
      const body = {
        vintner: 'Test Winery 2',
        category: 'White',
        varietal: 'Pinot Grigio'
      };

      const req = {
        headers: {
          host: 'localhost:3333'
        },
        bottle: {
          vintner: 'Test Winery',
          category: 'White',
          varietal: 'Pinot Grigio',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            vintner: 'Test Winery',
            category: 'White',
            varietal: 'Pinot Grigio',
            _id: '65105443bd7060ad271c1559'
          }),
          save: () => ({
            then: () => ({
              function() {}
            })
          })
        },
        body
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = bottleController(bottleModel);
      const result = await controller.put(req, res);

      res.status.calledWith(200).should.equal(true, `Expected status 200 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // PATCH /api/v1/bottle/:id test patch controller function when item is found
  describe('PatchOK', () => { // simple get by bottle id
    it('should allow get by id, update and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        bottle: {
          vintner: 'Test Winery',
          category: 'White',
          varietal: 'Chardonnay',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            vintner: 'Test Winery',
            category: 'White',
            varietal: 'Chardonnay',
            _id: '65105443bd7060ad271c1559'
          }),
          save: () => {}
        },
        body: {}
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = bottleController(bottleModel);
      const result = await controller.patch(req, res);

      res.status.calledWith(200).should.equal(true, `Expected status 200 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // DELETE /api/v1/bottle/:id test delete controller function when item is found
  describe('DeleteBottleOK', () => { // simple get by bottle id
    it('should allow get by id, delete and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        bottle: {
          vintner: 'Test Winery',
          category: 'White',
          varietal: 'Chardonnay',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            vintner: 'Test Winery',
            category: 'White',
            varietal: 'Chardonnay',
            _id: '65105443bd7060ad271c1559'
          }),
          deleteOne: () => {}
        }
      };

      const res = {
        status: sinon.spy(),
        sendStatus: sinon.spy(),
        json: sinon.spy(),
        send: sinon.spy()
      };

      const controller = bottleController(bottleModel);
      const result = await controller.deleteBottle(req, res);

      res.sendStatus.calledWith(204).should.equal(true, `Expected status 204 and got status ${res.sendStatus.args[0][0]}`);
    });
  });
});