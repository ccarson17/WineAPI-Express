/* eslint-disable no-underscore-dangle */
import Debug from 'debug';

function createRackLinks(host, rack) {
  const links = {};
  links.self = `http://${host}/api/v1/racks/${rack._id}`;
  links.FilterBottlesByThisRack = `http://${host}/api/v1/bottle/?rackId=${rack._id}`;
  links.FilterRacksByThisOwner = `http://${host}/api/v1/rack/?ownerId=${rack.ownerId}`;
  return links;
}

function rackController(Rack) {
  const debug = Debug('wineapi-express:rackController');
  function post(req, res) {
    const data = req.body;
    if (!data || !data.ownerId || !data.rackName || !data.rackLayout) {
      res.status(400);
      res.send('missing required items in post body');
      return;
    }
    if (!Number.isInteger(data.rows) || data.rows < 1
    || !Number.isInteger(data.cols) || data.cols < 1) {
      res.status(400);
      res.send('rows and cols must be integers greater than 0');
      return;
    }
    const rack = new Rack(req.body);
    debug('Saving rack...');
    rack.save();
    const newRack = rack.toJSON();
    newRack.links = createRackLinks(req.headers.host, rack); // create HATEOAS links
    res.status(201);
    res.json(newRack);
  }
  function get(req, res) {
    (async function Result() {
      const query = {};
      if (req.query.ownerId) query.ownerId = req.query.ownerId;
      debug('Finding racks...');
      const racks = await Rack.find(query);
      const returnRacks = racks.map((rack) => {
        const newRack = rack.toJSON();
        newRack.links = createRackLinks(req.headers.host, rack); // create HATEOAS links
        return newRack;
      });
      return res.json(returnRacks);
    }());
  }
  function findById(req, res, next) {
    debug('in findById');
    const wineId = req.params.id;
    (async function Result() {
      debug('Finding rack...');
      try {
        const rack = await Rack.findById(wineId);
        if (rack) {
          req.rack = rack;
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
    const returnRack = req.rack.toJSON();
    returnRack.links = createRackLinks(req.headers.host, req.rack); // create HATEOAS links
    res.json(returnRack);
  }
  function put(req, res) {
    const { rack } = req;
    rack.rackName = req.body.rackName;
    rack.rackLayout = req.body.rackLayout;
    rack.rackStyle = req.body.rackStyle;
    rack.rows = req.body.rows;
    rack.cols = req.body.cols;
    try {
      rack.save();
      const returnRack = rack.toJSON();
      returnRack.links = createRackLinks(req.headers.host, rack); // HATEOAS links
      res.status(200);
      res.json(returnRack);
    } catch (err) {
      res.send(err);
    }
  }
  function patch(req, res) {
    const { rack } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      rack[key] = value;
    });
    try {
      rack.save();
      const returnRack = rack.toJSON();
      returnRack.links = createRackLinks(req.headers.host, rack); // HATEOAS links
      res.status(200);
      res.json(returnRack);
    } catch (err) {
      res.send(err);
    }
  }
  function deleteRack(req, res) {
    const { rack } = req;
    try {
      rack.deleteOne();
      res.sendStatus(204);
    } catch (err) {
      res.send(err);
    }
  }
  return {
    post, get, findById, getById, put, patch, deleteRack
  };
}

export default rackController;
