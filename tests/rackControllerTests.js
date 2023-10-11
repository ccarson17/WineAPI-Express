import should from 'should';
import sinon from 'sinon';
import { expect } from 'chai';
import rackController from '../controllers/rackController.js';
import rackModel from '../models/rackModel.js';

// unit test for JUST post on rackController
// TO DO: Write unit tests for all operations
describe('Rack Controller Tests (Unit)', () => {
  // POST /api/v1/rack test controller function when rackName parameter NOT provided
  describe('PostNoRackName', () => {
    it('should not allow empty rack name field on post', () => {
      const Rack = function (rack) { this.save = () => {}; };

      const req = {
        body: {
          ownerId: '123456789',
          rackLayout: 'Standard',
          rows: 5,
          cols: 5
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = rackController(Rack);
      controller.post(req, res);

      res.status.calledWith(400).should.equal(true, `Expected status 400 and got status ${res.status.args[0][0]}`);
      res.send.calledWith('missing required items in post body').should.equal(true, 'Expected message: missing required items in post body');
    });
  });
  // POST /api/v1/rack test controller function when row/col parameters NOT provided
  describe('PostNoRackRowsCols', () => {
    it('should not allow empty vintner field on post', () => {
      const Rack = function (rack) { this.save = () => {}; };

      const req = {
        body: {
          ownerId: '123456789',
          rackLayout: 'Standard',
          rackName: 'Test Rack'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = rackController(Rack);
      controller.post(req, res);

      res.status.calledWith(400).should.equal(true, `Expected status 400 and got status ${res.status.args[0][0]}`);
      res.send.calledWith('rows and cols must be integers greater than 0').should.equal(true, 'Expected message: missing required items in post body');
    });
  });
  // POST /api/v1/rack test controller function when all required parameters provided
  describe('PostOK', () => {
    it('should allow post if all fields are provided', () => {
      const Rack = function (rack) {
        this.save = () => {};
        this.toJSON = () => ({
          ...rack
        });
      };

      const req = {
        headers: {
          host: 'localhost:3333'
        },
        body: {
          ownerId: '123456789',
          rackLayout: 'Standard',
          rackName: 'Test Rack',
          rows: 5,
          cols: 5
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = rackController(Rack);
      controller.post(req, res);

      res.status.calledWith(201).should.equal(true, `Expected status 201 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // GET /api/v1/rack test controller function when all required parameters provided
  describe('GetOK', () => {
    it('should allow get and return', async () => {
      const testRacks = [
        {
          ownerId: '123456789',
          rackLayout: 'Standard',
          rackName: 'Test Rack',
          rows: 5,
          cols: 5,
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            ownerId: '123456789',
            rackLayout: 'Standard',
            rackName: 'Test Rack',
            rows: 5,
            cols: 5,
            _id: '65105443bd7060ad271c1559'
          })
        }
      ];
      const stub = sinon.stub(rackModel, 'find').returns(testRacks);
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        query: {
          ownerId: '123456789'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = rackController(rackModel);
      const result = await controller.get(req, res);

      res.json.called.should.equal(true, 'res.json was not called');

      sinon.restore();
    });
  });
  // /api/v1/rack test findById controller middleware when all required parameters provided
  describe('FindByIdOK', () => { // middleware function used for getById, put, patch and deleteRack to find to rack to operate on.
    it('should allow get by id and return', async () => {
      const testRack = {
        ownerId: '123456789',
        rackLayout: 'Standard',
        rackName: 'Test Rack',
        rows: 5,
        cols: 5,
        _id: '65105443bd7060ad271c1559'
      };

      const stub = sinon.stub(rackModel, 'findById').returns(testRack);

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

      const controller = rackController(rackModel);
      const result = await controller.findById(req, res, next);

      next.called.should.equal(true, 'next() was not called');

      sinon.restore();
    });
  });
  // /api/v1/rack test findById controller middleware when item is not found
  describe('FindById404', () => { // middleware function used for getById, put, patch and deleteRack to find to rack to operate on.
    it('should return 404 error when id not found', async () => {
      const stub = sinon.stub(rackModel, 'findById').returns(null);

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

      const controller = rackController(rackModel);
      const result = await controller.findById(req, res, next);

      res.sendStatus.calledWith(404).should.equal(true, `Expected status 404 and got status ${res.sendStatus.args[0][0]}`);

      sinon.restore();
    });
  });
  // GET /api/v1/rack/:id test getById controller function when item is found
  describe('GetByIdOK', () => { // simple get by rack id
    it('should allow get by id and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        rack: {
          ownerId: '123456789',
          rackLayout: 'Standard',
          rackName: 'Test Rack',
          rows: 5,
          cols: 5,
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            ownerId: '123456789',
            rackLayout: 'Standard',
            rackName: 'Test Rack',
            rows: 5,
            cols: 5,
            _id: '65105443bd7060ad271c1559'
          })
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = rackController(rackModel);
      const result = await controller.getById(req, res);

      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // PUT /api/v1/rack/:id test put controller function when item is found
  describe('PutOK', () => { // simple get by rack id
    it('should allow get by id, update and return', async () => {
      const body = {
        ownerId: '123456789',
        rackLayout: 'Standard',
        rackName: 'Test Rack',
        rows: 5,
        cols: 5,
        _id: '65105443bd7060ad271c1559'
      };

      const req = {
        headers: {
          host: 'localhost:3333'
        },
        rack: {
          ownerId: '123456789',
          rackLayout: 'Standard',
          rackName: 'Test Rack',
          rows: 5,
          cols: 5,
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            ownerId: '123456789',
            rackLayout: 'Standard',
            rackName: 'Test Rack',
            rows: 5,
            cols: 5,
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

      const controller = rackController(rackModel);
      const result = await controller.put(req, res);

      res.status.calledWith(200).should.equal(true, `Expected status 200 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // PATCH /api/v1/rack/:id test patch controller function when item is found
  describe('PatchOK', () => { // simple get by rack id
    it('should allow get by id, update and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        rack: {
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

      const controller = rackController(rackModel);
      const result = await controller.patch(req, res);

      res.status.calledWith(200).should.equal(true, `Expected status 200 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // DELETE /api/v1/rack/:id test delete controller function when item is found
  describe('DeleteRackOK', () => { // simple get by rack id
    it('should allow get by id, delete and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        rack: {
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

      const controller = rackController(rackModel);
      const result = await controller.deleteRack(req, res);

      res.sendStatus.calledWith(204).should.equal(true, `Expected status 204 and got status ${res.sendStatus.args[0][0]}`);
    });
  });
});
