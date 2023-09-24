import { mongoose, Schema } from 'mongoose';

const userModel = new Schema(
  {
    userName: { type: String }
  }
);

const User = mongoose.model('User', userModel);
export default User;
