const Sequence = require("../models/sequenceFlowchart");
const { scheduleEmail } = require("../services/scheduleEmail");
const asyncHandler = require("express-async-handler");

const schedule = asyncHandler(async (req, res) => {
  const { nodes, edges } = req.body;
  try {
    const newSequence = new Sequence({ nodes, edges });
    await newSequence.save();

    await scheduleEmail();
    res.status(200).send("Sequence saved and emails scheduled");
  } catch (error) {
    console.log("error saving sequence", error);
    res.status(500).send("Error saving sequence");
  }
});

module.exports = schedule;
