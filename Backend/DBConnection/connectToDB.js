require("dotenv");
const mongoose = require("mongoose");

const URI="mongodb+srv://vishalagraharibasti:Agrahari123@cluster0.fwudeea.mongodb.net/Finance_Tracker?retryWrites=true&w=majority";
const ConnectDB = async () => {
  try {
    await mongoose.connect(URI).then(console.log("Connection Successfull"));
  } catch (error) {
    console.log(error);
  }
};
module.exports=ConnectDB;