import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "apikey",
    pass: process.env.BREVO_SMTP_KEY
  }
});

async function test() {
  try {
    await transporter.sendMail({
      from: `"Nayan'sOrg" <${process.env.BREVO_SMTP_MAIL}>`,
      to: "nayanawasthi109@gmail.com",
      subject: "SMTP Test",
      text: "This is a test email."
    });
    console.log("✅ Email sent!");
  } catch (err) {
    console.error("❌ Failed:", err.message);
  }
}

test();
