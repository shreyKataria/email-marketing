const agenda = require("../jobs/agenda");

const scheduleEmail = async (req, res) => {
  const { email, body, subject, delay } = req.body;
  try {
    const job = await agenda.schedule(delay, "send email", {
      email,
      subject,
      body,
    });
    const scheduledTime = new Date(job.attrs.nextRunAt).toLocaleString();
    res.status(200).json({
      message: "Email scheduled successfully",
      scheduledTime: scheduledTime,
    });
  } catch (error) {
    console.error("Error scheduling email:", error);
    res.status(500).json({ message: "Error scheduling email" });
  }
};

module.exports = {
  scheduleEmail,
};
