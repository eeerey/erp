import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * HELPER: Generate 6 Digit Angka Random OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Pengiriman Email Verifikasi OTP 6 Digit
 */
export const sendVerificationEmail = async (targetEmail, otpCode) => {
  await transporter.sendMail({
    from: `"ERP System" <${process.env.SMTP_USER}>`,
    to: targetEmail,
    subject: "Kode OTP Verifikasi Akun ERP Anda",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Verifikasi Akun Anda</h2>
        <p>Terima kasih telah mendaftar. Gunakan kode OTP di bawah ini untuk mengaktifkan akun Anda:</p>
        <div style="margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background-color: #f4f4f4; padding: 10px 20px; border-radius: 6px; border: 1px solid #ddd; color: #0070f3;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #666; font-size: 14px;">Kode verifikasi ini berlaku selama 15 menit.</p>
      </div>
    `,
  });
};
