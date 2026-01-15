import user from '../Schema/Userauth.js';

export const UserDetails = async (userData) => {
  try {
    return await user.create(userData);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const findbyEmail = async (email) => {
  try {
    return await user.findOne({ email });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const saveOTPData = async (userDoc, otpHash) => {
  userDoc.otpHash = otpHash;
  userDoc.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
  userDoc.otpAttempts = 0;
  userDoc.otpVerified = false;
  userDoc.otpLastSentAt = new Date();
  await userDoc.save();
};

export const clearOTP = async (userDoc) => {
  userDoc.otpHash = null;
  userDoc.otpExpires = null;
  userDoc.otpAttempts = 0;
  await userDoc.save();
};
