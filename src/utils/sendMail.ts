import { ApiError } from "../utils/apiErrors";
import logger from "../utils/logger";
import transporter from "../config/nodemailer";

//  Send password reset email with token
export const sendResetPasswordEmail = async (
  email: string,
  resetToken: string,
  resetUrl: string
): Promise<void> => {
  try {
    const mailOptions = {
      from: `"SecureBlink Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h1>Password Reset</h1>
        <p>You requested a password reset. Please use the link below to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    logger.info(`Password reset email sent to ${email}`);

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error("Error sending email:", error);
      }
       return 
    });
  } catch (error) {
    logger.error("Error sending password reset email:", error);
    throw new ApiError(500, "Error sending password reset email");
  }
};

// Send password changed confirmation email
export const sendPasswordChangedConfirmation = async (
  email: string
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `"SecureBlink Support" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Password Changed Successfully",
      html: `
        <h1>Password Changed</h1>
        <p>Your password has been changed successfully.</p>
        <p>If you did not make this change, please contact support immediately.</p>
      `,
    });

    logger.info(`Password change confirmation email sent to ${email}`);
  } catch (error) {
    logger.error("Error sending password changed confirmation email:", error);
    // We don't throw here as this is not critical for the user flow
  }
};
