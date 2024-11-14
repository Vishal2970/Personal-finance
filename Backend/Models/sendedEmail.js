const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    match: /^\d{10}$/, // Validates a 10-digit mobile number
  },
  emailID: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, // Validates email format
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  emailVerificationToken: {
    type: String,
    required: false,
  },
  isMailSended:{
    type:Boolean,
    default:false,
  }
});

const mailSendingStatus = new mongoose.model("mailSendingStatus", userSchema);
module.exports = mailSendingStatus;
