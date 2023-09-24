import { mongoose, Schema } from 'mongoose';

const bottleTestModel = new Schema(
  {
    vintner: { type: String },
    type: { type: String },
    varietal: { type: String }
  }
);

const BottleTest = mongoose.model('BottleTest', bottleTestModel, 'winetest');
export default BottleTest;
