const express = require("express");
const { scheduleEmail } = require("../controllers/emailController");

const router = express.Router();

router.post("/schedule-email", scheduleEmail);

module.exports = router;
