require("dotenv");
const writeLog = require("../Utility/logger");
const mongoose = require("mongoose");

const URI = process.env.URI;
const ConnectDB = async () => {
  writeLog(`started connecting to DB with URI :${URI}`);
  try {
    await mongoose.connect(URI);
    writeLog(`Connection Successfull`);
    console.log("Connection Successfull");
  } catch (error) {
    writeLog(`error in ConnectDB ${error}`);
    console.log(error);
  }
};
module.exports = ConnectDB;
