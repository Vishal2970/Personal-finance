require("dotenv").config();
const express = require("express");
// const writeLog = require('./Utility/logger');
const app = express();
const path = require('path');
const cors = require("cors");
const ConnectDB = require("./DBConnection/connectToDB");
const authRoute = require("./Routes/authRoute");
const pageCheck = require("./Routes/pageRoute");
const logInApis = require('./Middleware/log');

// CORS Options
const corsOptions = {
  origin: '*',
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());


// Routes
app.use("/api/auth",logInApis, authRoute);
app.use("/api/page", logInApis,pageCheck);
// Server Port
const PORT = process.env.PORT||5000;
if (!PORT) {
  throw new Error("PORT is not available in environment variables");
}

// Database Connection and Server Start
ConnectDB().then(() => {
  app.listen(PORT, () => {
    // writeLog(`Connection successful at PORT ${PORT}`);
    console.log(`Server is running at PORT: ${PORT}`);
  });
}).catch(error => {
  console.error("Database connection failed", error);
  process.exit(1);
});