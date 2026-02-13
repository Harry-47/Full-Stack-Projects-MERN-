const nodemailer = require('nodemailer');

const createTransporter = () => {
    
    const transporter = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASS
        }
    });

    return transporter;
};

const sendEmail = async (to, subject, html) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: '"StaffGrid" <noreply@StaffGrid.com>',
            to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);

        return { success: true };

    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error: error.message };
    }
};

const sendTaskNotification = async (employeeEmail, employeeName, taskTitle, managerName) => {
  try {

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS
      }
    });

    // Email Content
    const mailOptions = {
      from: '"StaffGrid Admin" <admin@staffgrid.com>',
      to: employeeEmail,
      subject: `📢 New Task Assigned: ${taskTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">New Task Assigned! 🚀</h2>
            <p>Hi <strong>${employeeName}</strong>,</p>
            <p>You have been assigned a new task by <strong>${managerName}</strong>.</p>
            
            <div style="background: #e1f5fe; padding: 15px; border-left: 5px solid #0288d1; margin: 20px 0;">
              <h3 style="margin: 0; color: #01579b;">${taskTitle}</h3>
              <p style="margin: 5px 0 0;">Check your dashboard for details and deadlines.</p>
            </div>

            <a href="http://localhost:5173/employee/dashboard" style="display: inline-block; background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Task</a>
            
            <p style="margin-top: 20px; font-size: 12px; color: #777;">StaffGrid Management System</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${employeeEmail}`);

  } catch (error) {
    console.error("❌ Email failed:", error);
    // Email fail hone se task fail nahi hona chahiye, isliye error swallow kar liya
  }
};

module.exports = { sendTaskNotification, sendEmail };