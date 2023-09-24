/* eslint-disable no-underscore-dangle */
import express from 'express';
import Debug from 'debug';
import BottleTest from '../models/bottleTestModel.js';
import bottleController from '../controllers/bottleTestController.js';

const debug = Debug('wineapi-express:wineDbRouter');
const wineDbRouter = express.Router();
const controller = bottleController(BottleTest);

// bottle search route
wineDbRouter.route('/testWine')
  .get(controller.get)
  .post(controller.post);

// middleware that finds the bottle in question before moving on to do something with it
wineDbRouter.use('/testWine/:id', (req, res, next) => {
  const wineId = req.params.id;
  const that = this;
  (async function Result() {
    debug('Finding bottle...');
    try {
      const bottle = await BottleTest.findById(wineId);
      if (bottle) {
        req.bottle = bottle;
        return next();
      }
      return res.sendStatus(404);
    } catch (err) {
      debug(err);
      res.status(400).send(err);
    }
  }());
});
// routes for operating on a specific bottle
wineDbRouter.route('/testWine/:id')
  .get((req, res) => {
    const returnBottle = req.bottle.toJSON();
    const vintner = req.bottle.vintner.replace(' ', '%20');
    const varietal = req.bottle.varietal.replace(' ', '%20');
    const type = req.bottle.type.replace(' ', '%20');
    // create HATEOAS links
    returnBottle.links = {};
    returnBottle.links.self = `http://${req.headers.host}/api/v1/testWine/${req.bottle._id}`;
    returnBottle.links.FilterByThisVintner = `http://${req.headers.host}/api/v1/testWine/?vintner=${vintner}`;
    returnBottle.links.FilterByThisVarietal = `http://${req.headers.host}/api/v1/testWine/?varietal=${varietal}`;
    returnBottle.links.FilterByThisType = `http://${req.headers.host}/api/v1/testWine/?type=${type}`;
    res.json(returnBottle);
  })
  .put((req, res) => {
    const { bottle } = req;
    bottle.vintner = req.body.vintner;
    bottle.type = req.body.type;
    bottle.varietal = req.body.varietal;
    bottle.save()
      .then((result) => { res.json(result); })
      .catch((err) => { res.send(err); });
  })
  .patch((req, res) => {
    const { bottle } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      bottle[key] = value;
    });
    bottle.save()
      .then((result) => { res.json(result); })
      .catch((err) => { res.send(err); });
  })
  .delete((req, res) => {
    const { bottle } = req;
    bottle.deleteOne()
      .then(() => { res.sendStatus(204); })
      .catch((err) => { res.send(err); });
  });

export default wineDbRouter;
