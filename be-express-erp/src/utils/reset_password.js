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
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `"Rintisku.id" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: subject,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 40px 0; color: #334155;">
        <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header Brand -->
          <div style="background: #0f172a; padding: 24px; text-align: center;">
            <h1 style="color: #ffffff; font-size: 22px; margin: 0; font-weight: 700; letter-spacing: 0.5px;">
              Rintisku<span style="color: #38bdf8;">.id</span>
            </h1>
          </div>

          <!-- Content Body -->
          <div style="padding: 32px 24px;">
            <h2 style="font-size: 18px; color: #0f172a; margin-top: 0; margin-bottom: 12px;">Reset Password Akun</h2>
            <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 8px;">
              Halo,
            </p>
            <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin-bottom: 24px;">
              Kamu menerima email ini karena ada permintaan untuk me-reset password akun Rintisku.id kamu. Gunakan kode di bawah ini untuk melanjutkan:
            </p>

            <!-- OTP Box Container -->
            <div style="text-align: center; margin: 24px 0;">
              <div style="display: inline-block; font-size: 32px; font-weight: 700; letter-spacing: 6px; background-color: #f1f5f9; padding: 14px 24px; border-radius: 8px; border: 1px dashed #cbd5e1; color: #0f172a;">
                ${otpCode}
              </div>
            </div>

            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-top: 24px; margin-bottom: 0;">
              Kode ini berlaku selama <strong style="color: #64748b;">10 menit</strong>. Jangan berikan kode ini kepada siapa pun, termasuk pihak Rintisku.id.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8fafc; padding: 16px 24px; text-align: center; border-top: 1px solid #f1f5f9;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0;">
              &copy; ${new Date().getFullYear()} Rintisku.id. Seluruh hak cipta dilindungi.
            </p>
          </div>

        </div>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};
