require("dotenv");
// const writeLog = require("../Utility/logger");
const mongoose = require("mongoose");

const URI = process.env.URI;
const ConnectDB = async () => {
  console.log(`started connecting to DB with URI :${URI}`);
  try {
    await mongoose.connect(URI);
    console.log("Connection Successfull");
  } catch (error) {
    console.log(`error in ConnectDB ${error}`);
    console.log(error);
  }
};
module.exports = ConnectDB;
