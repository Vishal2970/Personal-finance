require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const ConnectDB = require("./DBConnection/connectToDB");
const authRoute = require("./Routes/authRoute");
const pageCheck = require("./Routes/pageRoute");

const corsOptions = {
  origin: "http://localhost:5000",
  method: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/page", pageCheck);

const PORT = process.env.PORT;

ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at Port :${PORT}`);
  });
});