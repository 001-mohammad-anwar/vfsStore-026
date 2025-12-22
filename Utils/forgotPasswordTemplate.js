const forgotPasswordTemplate = ({ name, otp }) => {
    return `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 20px; text-align: center;">
            <div style="max-width: 400px; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); margin: auto;">
                <h2 style="color: #1d4ed8; font-size: 24px; font-weight: bold;">Password Reset Request</h2>
                <p style="color: #4b5563; font-size: 16px;">Hello, <strong>${name}</strong></p>
                <p style="color: #4b5563; font-size: 16px;">You requested a password reset. Use the OTP below to reset your password:</p>
                <div style="background-color: #e0f2fe; color: #1e40af; font-size: 24px; font-weight: bold; padding: 10px; border-radius: 5px; display: inline-block; margin: 10px 0;">
                    ${otp}
                </div>
                <p style="color: #6b7280; font-size: 14px;">This OTP is valid for 1 hour. If you did not request this, please ignore this email.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
                <p style="color: #9ca3af; font-size: 12px;">&copy; ${new Date().getFullYear()} BFS. All rights reserved.</p>
            </div>
        </div>
    `;
};

module.exports = forgotPasswordTemplate;
