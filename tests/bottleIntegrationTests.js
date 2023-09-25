import should from 'should';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';

process.env.ENV = 'Test';

const Bottle = mongoose.model('Bottle');
const agent = request.agent(app);

// can send actual post to DB, then get, then put, then patch, then delete to fully test an endpoint
// TO DO: CRUD tests on each endpoint (post, get, put, patch, delete)
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
