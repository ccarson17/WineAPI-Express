/* eslint-disable no-underscore-dangle */
import should from 'should';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

process.env.ENV = 'Test';

const Bottle = mongoose.model('Bottle');
const agent = request.agent(app);

// can send actual post to DB, then get, then put, then patch, then delete to fully test an endpoint
// TO DO: CRUD tests on each endpoint (post, get, put, patch, delete)

let testBottleId = null;
let testBottle2Id = null;

describe('Bottle CRUD Tests (Integration)', () => {
  it('should allow a bottle to be posted and return it', (done) => {
    const bottlePost = {
      vintner: 'Test Wine',
      varietal: 'Pinot Testo',
      category: 'Red'
    };

    agent.post('/api/v1/bottle')
      .send(bottlePost)
      .expect(200)
      .end((err, results) => {
        results.body.vintner.should.equal('Test Wine');
        results.body.varietal.should.equal('Pinot Testo');
        results.body.category.should.equal('Red');
        results.body.should.have.property('_id');
        testBottleId = results.body._id;
        done();
      });
  });
  it('should allow a second bottle to be posted and return it', (done) => {
    const bottlePost = {
      vintner: 'Test Wine 2',
      varietal: 'Pinot Testo 2',
      category: 'White'
    };

    agent.post('/api/v1/bottle')
      .send(bottlePost)
      .expect(200)
      .end((err, results) => {
        results.body.vintner.should.equal('Test Wine 2');
        results.body.varietal.should.equal('Pinot Testo 2');
        results.body.category.should.equal('White');
        results.body.should.have.property('_id');
        testBottle2Id = results.body._id;
        done();
      });
  });
  it('should allow a bottle to found by id', (done) => {
    agent.get(`/api/v1/bottle/${testBottleId}`)
      .expect(200)
      .end((err, results) => {
        results.body.vintner.should.equal('Test Wine');
        results.body.varietal.should.equal('Pinot Testo');
        results.body.category.should.equal('Red');
        results.body.should.have.property('_id');
        done();
      });
  });
  it('should allow a bottle to be updated (put) and return it', (done) => {
    const bottlePut = {
      vintner: 'Test Wine Put',
      varietal: 'Pinot Testo Put',
      category: 'White'
    };

    agent.put(`/api/v1/bottle/${testBottleId}`)
      .send(bottlePut)
      .expect(200)
      .end((err, results) => {
        results.body.vintner.should.equal('Test Wine Put');
        results.body.varietal.should.equal('Pinot Testo Put');
        results.body.category.should.equal('White');
        results.body.should.have.property('_id');
        done();
      });
  });
  it('should allow a bottle to be updated (patch) and return it', (done) => {
    const bottlePatch = {
      vintner: 'Test Wine 2.1'
    };

    agent.patch(`/api/v1/bottle/${testBottle2Id}`)
      .send(bottlePatch)
      .expect(200)
      .end((err, results) => {
        results.body.vintner.should.equal('Test Wine 2.1');
        results.body.varietal.should.equal('Pinot Testo 2');
        results.body.category.should.equal('White');
        results.body.should.have.property('_id');
        done();
      });
  });
  it('should allow a bottle to be deleted', (done) => {
    agent.patch(`/api/v1/bottle/${testBottle2Id}`)
      .expect(204)
      .end((err, results) => {
        done();
      });
  });
  afterEach((done) => {
    done();
  });

  after((done) => {
    Bottle.deleteMany({}).exec();
    mongoose.connection.close();
    app.server.close(done());
  });
});
