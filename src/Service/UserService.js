import {
  clearOTP,
  findbyEmail,
  saveOTPData,
  UserDetails
} from '../Repository/UserRepo.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../Utils/jwt.js';
import { sendOtpViaBrevo } from '../Utils/sendOTPviaBrevo.js';

export const signUpService = async (data) => {
  try {
    // Check if user already exists
    const existingUser = await findbyEmail(data.email);
    if (existingUser) {
      const error = new Error('User already exists with this email');
      error.statusCode = 409;
      throw error;
    }

    // Hash password

    const hashedPassword = await bcrypt.hash(data.password, 10);
    // Create a new user
    const user = await UserDetails({
      name: data.name,
      email: data.email,
      password: hashedPassword
    });

    return user;
  } catch (error) {
    console.error('UserService Error:', error.message);
    throw error;
  }
};

export const loginService = async (data) => {
  try {
    const user = await findbyEmail(data.email);

    if (!user) {
      const error = new Error('User does not exist');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordCorrect = await bcrypt.compare(
      data.password,
      user.password
    );

    if (!isPasswordCorrect) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken({
      id: user.id,
      email: user.email
    });

    return {
      token,
      user
    };
  } catch (error) {
    console.error('UserService Error:', error.message);
    throw error;
  }
};

export const sendOtpViaBrevoService = async (email) => {
  const user = await findbyEmail(email);
  if (!user) throw new Error('User not found');

  // ⏳ resend cooldown (60 sec)
  if (
    user.otpLastSentAt &&
    Date.now() - user.otpLastSentAt.getTime() < 60 * 1000
  ) {
    throw new Error('Please wait before requesting another OTP');
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  const sent = await sendOtpViaBrevo(email, otp);
  if (!sent) throw new Error('Failed to send OTP');

  await saveOTPData(user, otpHash);

  return { message: 'OTP sent successfully' };
};

/* ================= VERIFY OTP ================= */

export const verifyOTPService = async (email, otp) => {
  const user = await findbyEmail(email);

  console.log('in service', user);

  if (!user || !user.otpHash) {
    throw new Error('Invalid or expired OTP');
  }

  if (user.otpExpires < new Date()) {
    await clearOTP(user);
    throw new Error('OTP expired');
  }

  if (user.otpAttempts >= 3) {
    await clearOTP(user);
    throw new Error('Too many attempts. Request new OTP');
  }

  const isMatch = await bcrypt.compare(otp, user.otpHash);
  if (!isMatch) {
    user.otpAttempts += 1;
    await user.save();
    throw new Error('Invalid OTP');
  }

  // ✅ OTP verified
  user.otpVerified = true;
  await clearOTP(user);

  return { message: 'OTP verified successfully' };
};

/* ================= RESET PASSWORD ================= */

export const resetPasswordService = async (email, password) => {
  const user = await findbyEmail(email);
  if (!user || !user.otpVerified) {
    throw new Error('OTP verification required');
  }

  user.password = await bcrypt.hash(password, 10);
  user.otpVerified = false; // reset flag
  await user.save();

  return { message: 'Password reset successful' };
};
