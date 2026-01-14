import nodemailer from "nodemailer";

export const sendOtpViaBrevo = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.BREVO_API_KEY
      }
    });

    console.log(
      "BREVO SMTP KEY LOADED:",
      process.env.BREVO_API_KEY ? "YES" : "NO"
    );
    console.log("OTP:", otp);

    await transporter.sendMail({
      from: `"Nayan'sOrg" <${process.env.BREVO_SMTP_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      html: `
        <h3>Your OTP Code</h3>
        <h2>${otp}</h2>
        <p>This OTP will expire in 5 minutes.</p>
      `
    });

    console.log("✅ OTP sent successfully via Brevo SMTP");
    return true;
  } catch (err) {
    console.error("❌ Error sending OTP:", err.message);
    return false;
  }
};
