import { findbyEmail, saveOTP, updateUserPassword, UserDetails, verifyOTP } from '../Repository/UserRepo.js';
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
      id:user.id,
      email: user.email
    })

    return {
      token,
      user
    }
  } catch (error) {
    console.error('UserService Error:', error.message);
    throw error;
  }
};


export const sendOtpViaBrevoService = async (email) => {
  try {
    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp);
    // Save OTP in DB via Repo
    await saveOTP(email, otp);

    // Send OTP mail
    const sent = await sendOtpViaBrevo(email, otp);
    if (!sent) throw new Error("Failed to send OTP email");

    return { success: true, message: "OTP sent successfully" };
  } catch (err) {
    console.error("Error in sendOtpViaBrevoService:", err.message);
    return { success: false, message: err.message };
  }
};


export const verifyOTPService = async (email, otp) => {
  const existingUser = await verifyOTP(email, otp);
  if (!existingUser) throw new Error("Invalid or expired OTP");
  console.log(existingUser);
  return { message: "OTP verified successfully" };
};

export const resetPasswordService = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  await updateUserPassword(email, hashedPassword);
  return { message: "Password reset successful" };
};