/* eslint-disable no-underscore-dangle */
import express from 'express';
import Debug from 'debug';
import User from '../models/userModel.js';
import userController from '../controllers/userController.js';

const debug = Debug('wineapi-express:userRouter');
const userRouter = express.Router();
const controller = userController(User);

userRouter.route('/')
  .get(controller.get)
  .post(controller.post);

userRouter.route('/:id')
  .get(controller.findById, controller.getById)
  .put(controller.findById, controller.put)
  .patch(controller.findById, controller.patch)
  .delete(controller.findById, controller.deleteUser);

export default userRouter;
