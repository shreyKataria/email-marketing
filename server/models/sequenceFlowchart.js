const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  data: {
    label: { type: String, required: true },
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
});

const edgeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  source: { type: String, required: true },
  target: { type: String, required: true },
});

const sequenceSchema = new mongoose.Schema(
  {
    nodes: [nodeSchema],
    edges: [edgeSchema],
  },
  { timestamps: true }
);

const Sequence = mongoose.model("Sequence", sequenceSchema);

module.exports = Sequence;
