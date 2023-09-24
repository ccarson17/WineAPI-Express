/* eslint-disable no-underscore-dangle */
import Debug from 'debug';

function bottleController(BottleTest) {
  const debug = Debug('wineapi-express:bottleTestController');
  function post(req, res) {
    const data = req.body;
    if (!data || !data.vintner || !data.varietal || !data.type) {
      res.status(400);
      res.send('missing required items in post body');
    }
    const bottle = new BottleTest(req.body);
    debug('Saving bottle...');
    bottle.save();
    res.status(201);
    res.json(bottle);
  }
  function get(req, res) {
    debug('in get...');
    (async function Result() {
      const query = {};
      if (req.query.vintner) query.vintner = req.query.vintner;
      if (req.query.varietal) query.varietal = req.query.varietal;
      if (req.query.type) query.type = req.query.type;
      debug('Finding bottles...');
      const bottles = await BottleTest.find(query);
      const returnBottles = bottles.map((bottle) => {
        const newBook = bottle.toJSON();
        newBook.links = {};
        newBook.links.self = `http://${req.headers.host}/api/v1/testWine/${bottle._id}`;
        return newBook;
      });
      return res.json(returnBottles);
    }());
  }
  return { post, get };
}

export default bottleController;
