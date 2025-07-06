import nodemailer from 'nodemailer';
import CryptoJS from 'crypto-js';

export const sendEmail = async (to, subject, text, encryptedPassword) => {
  const secretKey = 'no-code-secret'; // Same key as frontend

  const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
  const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: to,
      pass: decryptedPassword
    }
  });

  await transporter.sendMail({
    from: to,
    to,
    subject,
    text
  });
};
