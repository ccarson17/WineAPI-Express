import { mongoose, Schema } from 'mongoose';

const bottleModel = new Schema(
  {
    ownerId: { type: String },
    rackId: { type: String },
    row: { type: Number },
    col: { type: Number },
    year: { type: String },
    vintner: { type: String },
    wineName: { type: String },
    category: { type: String },
    varietal: { type: String },
    cityTown: { type: String },
    region: { type: String },
    stateProvince: { type: String },
    country: { type: String },
    expertRatings: { type: String },
    size: { type: String },
    abv: { type: String },
    winemakerNotes: { type: String },
    whereBought: { type: String },
    pricePaid: { type: String },
    userRating: { type: Number },
    drinkDate: { type: String },
    createdDate: { type: String },
    userNotes: { type: String }
  }
);

const Bottle = mongoose.model('Bottle', bottleModel);
export default Bottle;
