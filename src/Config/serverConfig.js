import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const DB_URL = process.env.DB_URL;
export const secretKey = process.env.MY_SECRET_KEY;
export const brevoSMTPKey = process.env.BREVO_SMTP_KEY;
export const brevoSMTPMail = process.env.BREVO_SMTP_EMAIL;
