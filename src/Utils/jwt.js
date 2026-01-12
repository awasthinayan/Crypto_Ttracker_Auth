import jwt from "jsonwebtoken";
import { secretKey } from "../Config/serverConfig.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, secretKey, { expiresIn: "1d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};