/* eslint-disable no-underscore-dangle */
import Debug from 'debug';

function createUserLinks(host, user) {
  const links = {};
  links.self = `http://${host}/api/v1/users/${user._id}`;
  links.MyBottles = `http://${host}/api/v1/bottles/?ownerId=${user._id}`;
  links.MyRacks = `http://${host}/api/v1/racks/?ownerId=${user._id}`;
  return links;
}

function userController(User) {
  const debug = Debug('wineapi-express:userController');
  function post(req, res) {
    const data = req.body;
    if (!data || !data.userName) {
      res.status(400);
      res.send('missing required items in post body');
    }
    const user = new User(req.body);
    debug('Saving user...');
    debug(req.body);
    user.save();
    const newUser = user.toJSON();
    newUser.links = createUserLinks(req.headers.host, user); // create HATEOAS links
    res.status(201);
    res.json(user);
  }
  function get(req, res) {
    (async function Result() {
      const query = {};
      if (req.query.userName) query.userName = req.query.userName;
      debug('Finding users...');
      const users = await User.find(query);
      const returnUsers = users.map((user) => {
        const newUser = user.toJSON();
        newUser.links = createUserLinks(req.headers.host, user); // create HATEOAS links
        return newUser;
      });
      return res.json(returnUsers);
    }());
  }
  function findById(req, res, next) {
    debug('in findById');
    const wineId = req.params.id;
    (async function Result() {
      debug('Finding user...');
      try {
        const user = await User.findById(wineId);
        if (user) {
          req.user = user;
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
    const returnUser = req.user.toJSON();
    returnUser.links = createUserLinks(req.headers.host, req.user); // create HATEOAS links
    res.json(returnUser);
  }
  function put(req, res) {
    const { user } = req;
    user.userName = req.body.userName;
    user.save()
      .then((result) => {
        const returnUser = result.toJSON();
        returnUser.links = createUserLinks(req.headers.host, result); // HATEOAS links
        res.json(returnUser);
      })
      .catch((err) => { res.send(err); });
  }
  function patch(req, res) {
    const { user } = req;
    if (req.body._id) {
      delete req.body._id;
    }
    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value = item[1];
      user[key] = value;
    });
    user.save()
      .then((result) => {
        const returnUser = result.toJSON();
        returnUser.links = createUserLinks(req.headers.host, result); // HATEOAS links
        res.json(returnUser);
      })
      .catch((err) => { res.send(err); });
  }
  function deleteUser(req, res) {
    const { user } = req;
    user.deleteOne()
      .then(() => { res.sendStatus(204); })
      .catch((err) => { res.send(err); });
  }
  return {
    post, get, findById, getById, put, patch, deleteUser
  };
}

export default userController;
