import transporter from "../lib/nodemailer.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

const sendWelcomeEmail = async (email, name, clientURL) => {
  const mailOptions = {
    from: `Mersal <${process.env.GOOGLE_SMTP_USER}>`,
    to: email,
    subject: "Welcome to Mersal",
    html: createWelcomeEmailTemplate(name, clientURL), // HTML body
  };
  const info = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log("Error while sending welcome email: ", error);
    }
    console.log("Welcome email sent: ", info.response);
    console.log("Message sent:", info.messageId);
  });
};

export default sendWelcomeEmail;
