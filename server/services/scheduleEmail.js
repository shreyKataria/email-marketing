const Sequence = require("../models/sequenceFlowchart");
const Agenda = require("agenda");
const nodemailer = require("nodemailer");

// Agenda to MongoDB connection
const agenda = new Agenda({
  db: { address: "mongodb://localhost:27017/agenda-jobs" },
});

// job to send an email
agenda.define("send email", async (job, done) => {
  const { from, to, subject, body } = job.attrs.data;
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
  try {
    await transporter.sendMail(
      {
        from: from,
        to: to,
        subject,
        text: body,
      },
      (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
        done(); // Signal completion of job
      }
    );

    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
});

const scheduleEmail = async () => {
  const sequence = await Sequence.findOne(); // Find the sequence document

  if (!sequence) {
    console.log("No sequence found");
    return;
  }

  // Find the lead source node in the sequence
  const leadSourceNode = sequence.nodes.find((n) =>
    n.data.label.startsWith("Lead-Source")
  );

  if (!leadSourceNode) {
    console.log("No Lead-Source node found, skipping sequence");
    await Sequence.findByIdAndDelete(sequence._id);
    return;
  }

  // Extract the recipient email address from the lead source node label
  const to = leadSourceNode?.data?.label?.split("- (")[1].split(")")[0];

  let totalDelay = 0; // Initialize total delay

  // Iterate through the nodes in the sequence
  for (const node of sequence.nodes) {
    if (node.data.label.startsWith("Cold-Email")) {
      // Extract subject and text from Cold-Email node label
      const subject = node.data.label.split("\n- (")[1]?.split(")")[0];
      const text = node.data.label.split(") ")[1] || "";

      // Add 5 seconds delay between emails to maintain the order
      totalDelay += 5000;

      // Schedule the email with the accumulated delay
      agenda.schedule(new Date(Date.now() + totalDelay), "send email", {
        to,
        subject,
        text,
      });
    } else if (node.data.label.startsWith("Wait/Delay")) {
      // Extract the delay time from the Wait/Delay node label and convert to milliseconds
      const delay = parseInt(
        node.data.label.split("- (")[1]?.split(" min")[0],
        10
      );
      totalDelay += delay * 60 * 1000; // Add the specified delay time to the total delay
    }
  }

  // Delete the sequence after scheduling all emails
  await Sequence.findByIdAndDelete(sequence._id);
};

module.exports = {
  scheduleEmail,
  agenda,
};
