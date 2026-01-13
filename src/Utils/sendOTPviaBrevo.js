import { createRequire } from "module";
const require = createRequire(import.meta.url);

const Sib = require("sib-api-v3-sdk");

export const sendOtpViaBrevo = async (email, otp) => {
  try {
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY; // ✅ from .env

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "nayanawasthi109@gmail.com", // must be verified in Brevo
      name: "Nayan'sOrg",
    };

    const receivers = [{ email }];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Your OTP Code",
      textContent: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      htmlContent: `<h3>Your OTP Code: <strong>${otp}</strong></h3><p>It will expire in 5 minutes.</p>`,
    });
    console.log(otp);
    console.log("✅ OTP sent successfully via Brevo");
    return true;
  } catch (err) {
    console.error("❌ Error sending OTP:", err.message);
    return false;
  }
};