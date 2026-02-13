const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const CONFIG_FILE = path.join(__dirname, "data", "config.json");

async function testEmail() {
    try {
        if (!fs.existsSync(CONFIG_FILE)) {
            console.log("❌ Config file not found");
            return;
        }
        const config = JSON.parse(fs.readFileSync(CONFIG_FILE));
        console.log("Config loaded for:", config.recipient);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: config.sender,
                pass: config.appPassword,
            },
        });

        console.log("Sending test email...");
        const info = await transporter.sendMail({
            from: config.sender,
            to: config.recipient,
            subject: "[HSM TEST] Debug Email",
            text: "This is a test email to verify credentials.",
        });

        console.log("✅ Email sent:", info.messageId);
    } catch (error) {
        console.error("❌ Failed to send email:", error.message);
    }
}

testEmail();
