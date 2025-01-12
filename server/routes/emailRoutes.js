const express = require("express");
const schedule = require("../controllers/emailController");

const router = express.Router();

router.post("/schedule-email", schedule);

module.exports = router;
