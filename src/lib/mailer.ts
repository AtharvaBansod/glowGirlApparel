import nodemailer from 'nodemailer';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';

interface SendEmailOptions {
    email: string;
    emailType: 'VERIFY' | 'RESET';
    userId: string;
}

export const sendEmail = async ({ email, emailType, userId }: SendEmailOptions) => {
    try {
        // 1. Generate a unique, hashed token
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);
        const tokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

        // 2. Update the user's document in the database with the token
        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: tokenExpiry,
            });
        } else if (emailType === 'RESET') {
            // Logic for password reset token would go here
            await User.findByIdAndUpdate(userId, {
                // forgotPasswordToken: hashedToken,
                // forgotPasswordTokenExpiry: tokenExpiry,
            });
        }

        // 3. Configure the email transporter using SMTP credentials from .env
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        
        const domain = process.env.DOMAIN || 'http://localhost:3000';
        const link = `${domain}/verify-email?token=${hashedToken}`;
        
        // 4. Define email content based on the email type
        const subject = emailType === 'VERIFY' 
            ? "Verify your Glow Girl Apparel account" 
            : "Reset your password";
        
        const body = `<p>Welcome to Glow Girl Apparel! Click <a href="${link}">here</a> to ${subject.toLowerCase()} or copy and paste the link below in your browser. <br> ${link}</p>`;

        // 5. Define mail options and send the email
        const mailOptions = {
            from: `"Glow Girl Apparel" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: subject,
            html: body,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        console.error("EMAIL_SENDING_ERROR:", error);
        throw new Error(error.message);
    }
};