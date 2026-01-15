import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Sib = require('sib-api-v3-sdk');
import { brevoSMTPKey, brevoSMTPMail } from '../Config/serverConfig.js';

export const sendOtpViaBrevo = async (email, otp) => {
  try {
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = brevoSMTPKey; // ✅ from .env

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: brevoSMTPMail, // must be verified in Brevo
      name: "Nayan'sOrg"
    };

    const receivers = [{ email }];
    console.log(
      '🔥 Using smtp key preview:',
      brevoSMTPKey.slice(0, 12) + '...'
    );
    console.log('🔥 Sending OTP to:', email);
    console.log("🔍 BREVO KEY LENGTH:", brevoSMTPKey?.length);

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Your OTP Code',
      textContent: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      htmlContent: `<h3>Your OTP Code: <strong>${otp}</strong></h3><p>It will expire in 5 minutes.</p>`
    });
    console.log(otp);
    console.log('✅ OTP sent successfully via Brevo');
    return true;
  } catch (err) {
    console.error('❌ Brevo Status:', err?.status);
    console.error('❌ Brevo Response:', err?.response?.body || err);
    return false;
  }
};
