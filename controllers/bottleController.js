/* eslint-disable no-underscore-dangle */
import Debug from 'debug';

function createBottleLinks(host, bottle) {
  const vintner = bottle.vintner ? bottle.vintner.replace(' ', '%20') : '';
  const varietal = bottle.varietal ? bottle.varietal.replace(' ', '%20') : '';
  const type = bottle.category ? bottle.category.replace(' ', '%20') : '';
  const links = {};
  links.self = `http://${host}/api/v1/bottles/${bottle._id}`;
  links.FilterByThisVintner = `http://${host}/api/v1/bottles/?vintner=${vintner}`;
  links.FilterByThisVarietal = `http://${host}/api/v1/bottles/?varietal=${varietal}`;
  links.FilterByThisType = `http://${host}/api/v1/bottles/?type=${type}`;
  return links;
}

function bottleController(Bottle) {
  const debug = Debug('wineapi-express:bottleController');
  function post(req, res) {
    const data = req.body;
    if (!data || !data.vintner || !data.varietal || !data.category) {
      res.status(400);
      res.send('missing required items in post body');
    }
    const bottle = new Bottle(req.body);
    debug('Saving bottle...');
    debug(req.body);
    bottle.save();
    const newBottle = bottle.toJSON();
    newBottle.links = createBottleLinks(req.headers.host, bottle.toJSON()); // HATEOAS links
    res.status(201);
    res.json(newBottle);
  }
  function get(req, res) {
    (async function Result() {
      const query = {};
      if (req.query.vintner) query.vintner = req.query.vintner;
      if (req.query.varietal) query.varietal = req.query.varietal;
      if (req.query.category) query.category = req.query.category;
      debug('Finding bottles...');
      const bottles = await Bottle.find(query);
      const returnBottles = bottles.map((bottle) => {
        const newBottle = bottle.toJSON();
        newBottle.links = createBottleLinks(req.headers.host, bottle.toJSON()); // HATEOAS links
        return newBottle;
      });
      return res.json(returnBottles);
    }());
  }
  function findById(req, res, next) {
    debug('in findById');
    const wineId = req.params.id;
    (async function Result() {
      debug('Finding bottle...');
      try {
        const bottle = await Bottle.findById(wineId);
        if (bottle) {
          req.bottle = bottle;
          return next();
        }
        return res.sendStatus(404);
      } catch (err) {
        debug(err);
        res.status(400);
        res.send(err);
      }
    }());
  }
  function getById(req, res) {
    const returnBottle = req.bottle.toJSON();
    returnBottle.links = createBottleLinks(req.headers.host, req.bottle); // create HATEOAS links
    res.json(returnBottle);
  }
  function put(req, res) {
    const { bottle } = req;
    bottle.vintner = req.body.vintner;
    bottle.category = req.body.category;
    bottle.varietal = req.body.varietal;
    bottle.save()
      .then((result) => {
        const returnBottle = result.toJSON();
        returnBottle.links = createBottleLinks(req.headers.host, result); // HATEOAS links
        res.json(returnBottle);
      })
      .catch((err) => { res.send(err); });
  }
  function patch(req, res) {
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
      .then((result) => {
        const returnBottle = result.toJSON();
        returnBottle.links = createBottleLinks(req.headers.host, result); // HATEOAS links
        res.json(returnBottle);
      })
      .catch((err) => { res.send(err); });
  }
  function deleteBottle(req, res) {
    const { bottle } = req;
    bottle.deleteOne()
      .then(() => { res.sendStatus(204); })
      .catch((err) => { res.send(err); });
  }
  return {
    post, get, findById, getById, put, patch, deleteBottle
  };
}

export default bottleController;
