/* eslint-disable no-underscore-dangle */
import express from 'express';
import Debug from 'debug';
import Bottle from '../models/bottleModel.js';
import bottleController from '../controllers/bottleController.js';

const debug = Debug('wineapi-express:bottleRouter');
const bottleRouter = express.Router();
const controller = bottleController(Bottle);

bottleRouter.route('/')
  .get(controller.get)
  .post(controller.post);

bottleRouter.route('/:id')
  .get(controller.findById, controller.getById)
  .put(controller.findById, controller.put)
  .patch(controller.findById, controller.patch)
  .delete(controller.findById, controller.deleteBottle);

export default bottleRouter;
