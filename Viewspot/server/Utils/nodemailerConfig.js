// utils/email.js
const nodemailer = require('nodemailer');

const createTransporter = () => {
    // Sirf Mailtrap ke credentials use karein ge
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: 'b390693547f6dc',
            pass: '0df98c61074d0b'
        }
    });

    return transporter;
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: '"ViewSpot" <noreply@ViewSpot.com>',
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        if(info.errno)
            return { success: false, error: 'Failed to send email. Try again!' };

        // Mailtrap ke liye preview URL ki zaroorat nahi
        return { success: true };

    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
};

module.exports = { sendEmail };