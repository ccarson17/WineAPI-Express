import should from 'should';
import sinon from 'sinon';
import { expect } from 'chai';
import userController from '../controllers/userController.js';
import userModel from '../models/userModel.js';

// unit test for JUST post on userController
// TO DO: Write unit tests for all operations
describe('User Controller Tests (Unit)', () => {
  // POST /api/v1/user test controller function when all required parameters NOT provided
  describe('PostNoUserName', () => {
    it('should not allow empty userName field on post', () => {
      const User = function (user) { this.save = () => {}; };

      const req = {
        body: {
          userName: ''
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = userController(User);
      controller.post(req, res);

      res.status.calledWith(400).should.equal(true, `Expected status 400 and got status ${res.status.args[0][0]}`);
      res.send.calledWith('missing required items in post body').should.equal(true, 'Expected message: missing required items in post body');
    });
  });
  // POST /api/v1/user test controller function when all required parameters provided
  describe('PostOK', () => {
    it('should allow post if all fields are provided', () => {
      const User = function (user) {
        this.save = () => {};
        this.toJSON = () => ({
          ...user
        });
      };

      const req = {
        headers: {
          host: 'localhost:3333'
        },
        body: {
          userName: 'TestUser'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = userController(User);
      controller.post(req, res);

      res.status.calledWith(201).should.equal(true, `Expected status 201 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // GET /api/v1/user test controller function when all required parameters provided
  describe('GetOK', () => {
    it('should allow get and return', async () => {
      const testUsers = [
        {
          userName: 'TestUser',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            userName: 'TestUser',
            _id: '65105443bd7060ad271c1559'
          })
        }
      ];
      const stub = sinon.stub(userModel, 'find').returns(testUsers);
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        query: {
          userName: 'TestUser'
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = userController(userModel);
      const result = await controller.get(req, res);

      res.json.called.should.equal(true, 'res.json was not called');

      sinon.restore();
    });
  });
  // /api/v1/user test findById controller middleware when all required parameters provided
  describe('FindByIdOK', () => { // middleware function used for getById, put, patch and deleteUser to find to user to operate on.
    it('should allow get by id and return', async () => {
      const testUser = {
        userName: 'TestUser',
        _id: '65105443bd7060ad271c1559'
      };

      const stub = sinon.stub(userModel, 'findById').returns(testUser);

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

      const controller = userController(userModel);
      const result = await controller.findById(req, res, next);

      next.called.should.equal(true, 'next() was not called');

      sinon.restore();
    });
  });
  // /api/v1/user test findById controller middleware when item is not found
  describe('FindById404', () => { // middleware function used for getById, put, patch and deleteUser to find to user to operate on.
    it('should return 404 error when id not found', async () => {
      const stub = sinon.stub(userModel, 'findById').returns(null);

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

      const controller = userController(userModel);
      const result = await controller.findById(req, res, next);

      res.sendStatus.calledWith(404).should.equal(true, `Expected status 404 and got status ${res.sendStatus.args[0][0]}`);

      sinon.restore();
    });
  });
  // GET /api/v1/user/:id test getById controller function when item is found
  describe('GetByIdOK', () => { // simple get by user id
    it('should allow get by id and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        user: {
          userName: 'TestUser',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            userName: 'TestUser',
            _id: '65105443bd7060ad271c1559'
          })
        }
      };

      const res = {
        status: sinon.spy(),
        send: sinon.spy(),
        json: sinon.spy()
      };

      const controller = userController(userModel);
      const result = await controller.getById(req, res);

      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // PUT /api/v1/user/:id test put controller function when item is found
  describe('PutOK', () => { // simple get by user id
    it('should allow get by id, update and return', async () => {
      const body = {
        userName: 'TestUser'
      };

      const req = {
        headers: {
          host: 'localhost:3333'
        },
        user: {
          userName: 'TestUser',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            userName: 'TestUser',
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

      const controller = userController(userModel);
      const result = await controller.put(req, res);

      res.status.calledWith(200).should.equal(true, `Expected status 200 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // PATCH /api/v1/user/:id test patch controller function when item is found
  describe('PatchOK', () => { // simple get by user id
    it('should allow get by id, update and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        user: {
          userName: 'TestUser',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            userName: 'TestUser',
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

      const controller = userController(userModel);
      const result = await controller.patch(req, res);

      res.status.calledWith(200).should.equal(true, `Expected status 200 and got status ${res.status.args[0][0]}`);
      res.json.called.should.equal(true, 'res.json was not called');
    });
  });
  // DELETE /api/v1/user/:id test delete controller function when item is found
  describe('DeleteUserOK', () => { // simple get by user id
    it('should allow get by id, delete and return', async () => {
      const req = {
        headers: {
          host: 'localhost:3333'
        },
        user: {
          userName: 'TestUser',
          _id: '65105443bd7060ad271c1559',
          toJSON: () => ({
            userName: 'TestUser',
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

      const controller = userController(userModel);
      const result = await controller.deleteUser(req, res);

      res.sendStatus.calledWith(204).should.equal(true, `Expected status 204 and got status ${res.sendStatus.args[0][0]}`);
    });
  });
});
