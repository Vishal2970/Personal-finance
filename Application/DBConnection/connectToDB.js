require("dotenv");
const mongoose = require("mongoose");

const URI = process.env.URI;
const ConnectDB = async () => {
  try {
    await mongoose.connect(URI).then(console.log("Connection Successfull"));
  } catch (error) {
    console.log(error);
  }
};
module.exports = ConnectDB;
