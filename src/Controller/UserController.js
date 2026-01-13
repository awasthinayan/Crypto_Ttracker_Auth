
import { findbyEmail } from '../Repository/UserRepo.js';
import {
  loginService,
  resetPasswordService,
  sendOtpViaBrevoService,
  signUpService,
  verifyOTPService
} from '../Service/UserService.js';

export const SignUpController = async (req, res) => {
  try {
    // 🔴 HANDLE ZOD VALIDATION ERROR FIRST
    if (req.validationError) {
      const issues = req.validationError.issues;

      // Option A: first error only
      return res.status(400).json({
        message: issues[0].message
      });
      // Option B: all errors
      // return res.status(400).json({
      //   message: errors.map((error) => error.message).join(', ')
      // });
    }

    const user = await signUpService(req.body);
    console.log(user);

    return res.status(201).json({
      message: 'User created successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }
    console.log(error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Email already exists'
      });
    }

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const LoginController = async (req, res) => {
  try {
    // 🔴 HANDLE ZOD VALIDATION ERROR FIRST
    if (req.validationError) {
      const issues = req.validationError.issues;

      return res.status(400).json({
        message: issues[0].message
      });
    }

    // 2️⃣ Call service layer
    const { user, token } = await loginService(req.body);

    if (token?.error) {
      return res.status(401).json({
        message: token.error,
        status: false
      });
    }

    // 3️⃣ Success response
    return res.status(200).json({
      message: 'User logged in successfully',
      status: true,
      data: {
        id: user._id,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login Controller Error:', error.message);

    // 4️⃣ Business logic errors
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        message: error.message
      });
    }

    // 5️⃣ Fallback server error
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export const sendOTPController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await findbyEmail(email);
    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    const result = await sendOtpViaBrevoService(email);

    if (result.success) {
      return res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      return res.status(400).json({ message: 'Failed to send OTP' });
    }
  } catch (error) {
    console.error('Error in sendOTPController:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await verifyOTPService(email, otp);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await resetPasswordService(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
