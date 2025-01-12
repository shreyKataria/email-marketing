require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const routes = require("./routes/emailRoutes");
const { agenda } = require("./services/scheduleEmail");

const app = express();

const port = process.env.PORT || 8000;

// middlewares
app.use(express.json());
app.use(cors());

// db
connectDB();

agenda.on("ready", () => {
  agenda.start();
});

// route
app.use("/api", routes);

// server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
