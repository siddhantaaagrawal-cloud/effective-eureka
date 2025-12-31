import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: ReturnType<typeof twilio> | null = null;

if (accountSid && authToken && phoneNumber) {
  twilioClient = twilio(accountSid, authToken);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOTP(phoneNumber: string, otp: string): Promise<boolean> {
  if (!twilioClient) {
    console.warn('Twilio not configured - OTP would be sent to:', phoneNumber, 'OTP:', otp);
    return true;
  }

  try {
    await twilioClient.messages.create({
      body: `Your verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
    return true;
  } catch (error) {
    console.error('Failed to send OTP via Twilio:', error);
    return false;
  }
}
