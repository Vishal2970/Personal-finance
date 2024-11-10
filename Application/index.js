require("dotenv").config();
const express = require("express");
const app = express();
const path = require('path');
const cors = require("cors");
const ConnectDB = require("./DBConnection/connectToDB");
const authRoute = require("./Routes/authRoute");
const pageCheck = require("./Routes/pageRoute");

const corsOptions = {
  origin: ["http://localhost:5500", "http://127.0.0.1:5500"],
  methods: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth", authRoute);
app.use("/api/page", pageCheck);

const PORT = process.env.PORT||5000;

ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at Port :${PORT}`);
  });
});
