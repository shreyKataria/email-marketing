const Agenda = require("agenda");
const nodemailer = require("nodemailer");

// Agenda to MongoDB connection
const agenda = new Agenda({
  db: { address: "mongodb://localhost:27017/agenda-jobs" },
});

// Nodemailer transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

// job to send an email
agenda.define("send email", async (job) => {
  const { email, subject, body } = job.attrs.data;

  try {
    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: email,
      subject,
      text: body,
    });
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
});

// Start Agenda
(async function () {
  await agenda.start();
})();

module.exports = agenda;
