import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();
const HOST = process.env.MAILTRAP_HOST;
const PORT = process.env.MAILTRAP_PORT;
const USERNAME = process.env.MAILTRAP_USERNAME;
const PASSWORD = process.env.MAILTRAP_PASSWORD;
const SENDER_EMAIL = process.env.MAILTRAP_SENDEREMAIL;
const BASE_URL = process.env.BASE_URL;

if (!HOST || !PORT || !USERNAME || !PASSWORD || !SENDER_EMAIL || !BASE_URL) {
  throw new Error('Missing environment variables');
}
const transporter = nodemailer.createTransport({
  host: HOST,
  port: PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: USERNAME,
    pass: PASSWORD,
  },
});

export default async function sendMail(email, token) {
  const mailOptions = {
    from: process.env.SENDER_EMAIL,
    to: email,
    subject: 'Email Verification',
    text: `Verify your email by clicking the link: ${BASE_URL}/api/v1/users/verify/${token}`,
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email', error);
    return {
      success: false,
      message: 'Error sending email',
    };
  }
}
