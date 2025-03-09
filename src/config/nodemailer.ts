import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_EMAIL_HOST!,
  port: 587,
  secure: false,
  // logger: true,
  // debug: true,
  auth: {
    user: process.env.SMTP_USER!,
    pass: process.env.SMTP_PASS!,
  },
});

// Just for the developement purpose
// transporter.verify((error) => {
//   if (error) {
//     logger.error("Email service error:", error);
//   } else {
//     logger.info("Email server is ready to send messages");
//   }
// });

export default transporter;
