const nodemailer = require("nodemailer");

/**
 * Send Email helper with automatic fallback for dev/testing
 * @param {Object} options 
 * @param {string} options.email 
 * @param {string} options.subject 
 * @param {string} options.message 
 */
const sendEmail = async (options) => {
    // Log message preview in terminal for easy local testing
    console.log(`\n========================================`);
    console.log(`✉️ [EMAIL REQUEST] To: ${options.email}`);
    console.log(`Subject: ${options.subject}`);
    
    // Extract reset link if present in message for direct console access
    const resetUrlMatch = options.message.match(/href="(http[^"]+)"/);
    if (resetUrlMatch && resetUrlMatch[1]) {
        console.log(`🔑 [PASSWORD RESET LINK]: ${resetUrlMatch[1]}`);
    }
    console.log(`========================================\n`);

    const hasGmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS && process.env.EMAIL_PASS.trim() !== "";

    if (hasGmailConfig) {
        try {
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS.trim()
                }
            });

            const mailOptions = {
                from: `"LuxeMarket" <${process.env.EMAIL_USER}>`,
                to: options.email,
                subject: options.subject,
                html: options.message
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`✅ [Gmail SMTP] Email successfully sent to ${options.email}. Message ID: ${info.messageId}`);
            return info;
        } catch (error) {
            console.error(`⚠️ [Gmail SMTP Failed]: ${error.message}`);
            console.log(`💡 [FALLBACK]: Falling back to Ethereal Test Email service...`);
        }
    }

    // Ethereal Fallback (or if Gmail credentials are bad/missing)
    try {
        const testAccount = await nodemailer.createTestAccount();
        const etherealTransporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        });

        const mailOptions = {
            from: `"LuxeMarket" <${process.env.EMAIL_USER || "noreply@luxemarket.dev"}>`,
            to: options.email,
            subject: options.subject,
            html: options.message
        };

        const info = await etherealTransporter.sendMail(mailOptions);
        const previewUrl = nodemailer.getTestMessageUrl(info);
        
        if (previewUrl) {
            console.log(`🌐 [Ethereal Preview Inbox]: ${previewUrl}`);
        }
        return info;
    } catch (etherealError) {
        console.error(`⚠️ [Ethereal Fallback Error]:`, etherealError.message);
        // Do not crash the API if email fails in local dev; reset link is already logged to terminal
    }
};

module.exports = sendEmail;