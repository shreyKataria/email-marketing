require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const routes = require("./routes/emailRoutes");

const app = express();

const port = process.env.PORT || 8000;

// db
connectDB();

// middlewares
app.use(express.json());
app.use(cors());

// route
app.use("/api", routes);

// server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
