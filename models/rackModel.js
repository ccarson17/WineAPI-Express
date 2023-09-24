import { mongoose, Schema } from 'mongoose';

const rackModel = new Schema(
  {
    ownerId: { type: String },
    rackName: { type: String },
    rackLayout: { type: String },
    rackStyle: { type: String },
    rows: { type: Number },
    cols: { type: Number }
  }
);

const Rack = mongoose.model('Rack', rackModel);
export default Rack;
