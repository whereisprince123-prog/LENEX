const resend = require("../config/resend");

const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Resend email error:", error);
            throw new Error("Email could not be sent");
        }

        return data;

    } catch (error) {
        console.error("Email service error:", error);
        throw error;
    }
};

module.exports = sendEmail;