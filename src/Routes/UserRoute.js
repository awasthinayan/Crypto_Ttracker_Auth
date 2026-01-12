import express from 'express';
import {
  LoginController,
  resetPasswordController,
  sendOTPController,
  SignUpController,
  verifyOTPController
} from '../Controller/UserController.js';
import {
  loginValidation,
  userValidation
} from '../Validation/UserValidation.js';
import { validate } from '../Middleware/validate.js';

const router = express.Router();

router.post('/user/signup', validate(userValidation), SignUpController);

router.post('/user/login', validate(loginValidation), LoginController);

router.post('/user/otp', sendOTPController);

router.post('/user/verifyotp', verifyOTPController);

router.post('/user/resetpassword', resetPasswordController);

export default router;
