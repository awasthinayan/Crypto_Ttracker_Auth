import mongoose from 'mongoose';

const userAuthSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email']
    },
    password: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const user = mongoose.model('user', userAuthSchema);

export default user;
