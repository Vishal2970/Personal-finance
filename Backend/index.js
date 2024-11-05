const express = require("express");
const app = express();
const cors = require("cors");
const ConnectDB = require("./DBConnection/connectToDB");
const authRoute = require("./Routes/authRoute");

const corsOptions = {
  origin: "http://localhost:5000",
  method: "GET,POST,PUT,DELETE,PATCH,HEAD",
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use("/api/route", authRoute);

const PORT = 5000;

ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at Port :${PORT}`);
  });
});
