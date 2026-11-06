require("dotenv").config();

const sendEmail = require("./utils/sendEmail");

const testEmail = async () => {
    try {
        const result = await sendEmail({
            to: "whereisprince123@gmail.com",
            subject: "LENEX Email Test",
            html: `
                <h2>Welcome to LENEX</h2>
                <p>Your Resend email integration is working!</p>
                <p>This is a test email from LENEX.</p>
            `,
        });

        console.log("Email sent successfully:", result);

    } catch (error) {
        console.error("Email test failed:", error.message);
    }
};

testEmail();