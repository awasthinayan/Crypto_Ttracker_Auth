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
      required: true
    },
    otpExpires: {
      type: Date,
      default: null
    },
    otpAttempts: {
      type: Number,
      default: 0
    },
    otpVerified: {
      type: Boolean,
      default: false
    },
    otpLastSentAt: {
      type: Date,
      default: null
    },
    otpHash: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
);

const user = mongoose.model('user', userAuthSchema);

export default user;
