/* eslint-disable no-underscore-dangle */
import express from 'express';
import Debug from 'debug';
import Rack from '../models/rackModel.js';
import rackController from '../controllers/rackController.js';

const debug = Debug('wineapi-express:rackRouter');
const rackRouter = express.Router();
const controller = rackController(Rack);

rackRouter.route('/')
  .get(controller.get)
  .post(controller.post);

rackRouter.route('/:id')
  .get(controller.findById, controller.getById)
  .put(controller.findById, controller.put)
  .patch(controller.findById, controller.patch)
  .delete(controller.findById, controller.deleteRack);

export default rackRouter;
