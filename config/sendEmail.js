const { Resend } = require('resend'); // ✅ Correct way to import Resend
require("dotenv").config();

// Check if API key is set
if (!process.env.RESEND_API) {
    console.error('RESEND_API is not set in environment variables');
}

const resend = new Resend(process.env.RESEND_API);

const sendEmail = async ({ sendTo, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Binkeyit <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            console.error("Resend Error:", error);
            return null;
        }

        return data;
    } catch (err) {
        console.error("Email Sending Error:", err);
        return null;
    }
};

module.exports = sendEmail;
