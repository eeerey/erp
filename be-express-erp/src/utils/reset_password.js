import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const sendEmailOtp = async (
  toEmail,
  otpCode,
  subject = "Kode OTP Reset Password",
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // TLS (port 587)
    auth: {
      user: process.env.SMTP_USER, // 👈 Disesuaikan dengan .env kamu
      pass: process.env.SMTP_PASS, // 👈 Disesuaikan dengan .env kamu
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"ERP System" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #1e3c72;">Reset Password OTP</h2>
        <p>Halo,</p>
        <p>Kamu menerima email ini karena ada permintaan untuk me-reset password akun kamu.</p>
        <div style="background-color: #f4f6f9; padding: 15px; text-align: center; border-radius: 6px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #764ba2;">${otpCode}</span>
        </div>
        <p>Kode OTP ini berlaku selama <strong>10 menit</strong>. Jangan berikan kode ini kepada siapapun.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
