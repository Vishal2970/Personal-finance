const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const mailSendingStatus = require("./sendedEmail");
const amountModel = require("./amountModel");
//const console.log = require('../Utility/logger');

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
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
    required: false,
  },
  emailVerificationTokenExpires: {
    type: Date,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
});

userSchema.methods.generateToken = async function () {
  console.log(`started generating token for ${this.userName} and email id ${this.emailID}`);
  try {
    const token = await new Promise((resolve, rejected) => {
      jwt.sign(
        {
          _id: this._id,
          userName: this.userName,
          emailID: this.emailID,
          isAdmin: this.isAdmin,
        },
        process.env.SecretKey,
        {
          expiresIn: "1hr",
        },
        (err, token) => {
          if (err) rejected(err);
          else resolve(token);
        }
      );
    });
    console.log(`token generated for ${this.userName} and email id ${this.emailID} token :${token}`);
    return token;
  } catch (error) {
    console.log(`error in token generation ${error}`);
    //console.log(error);
  }
};

//password hashing and generate token
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

userSchema.methods.passwordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

async function deleteExpiredVerificationTokens() {
  console.log("Started running crons ");

  try {
    console.log("started to delete sending mails");

    const mailSendingEmails = await mailSendingStatus.distinct("emailID");
    const userEmails = await user.distinct("emailID");
    const emailsToDelete = mailSendingEmails.filter((email) => !userEmails.includes(email));
    if (emailsToDelete.length > 0) {
      console.log("emailsToDelete from mailSendingEmails");
      console.log(emailsToDelete);
      await mailSendingStatus.deleteMany({ emailID: { $in: emailsToDelete } });
    } else {
      console.log("no emails to delete are found in mail Sending Emails model");
    }

    console.log("started to delete amount added");
    const amountEmails = await amountModel.distinct("emailID");
    const emailToDeleteFromAmount=amountEmails.filter((email)=>!userEmails.includes(email));
    if(emailToDeleteFromAmount.length>0){
      console.log("emailsToDelete from amountModel");
      console.log(emailToDeleteFromAmount);
      await amountModel.deleteMany({ emailID: { $in: emailToDeleteFromAmount } });
    }else{
      console.log("no emails to delete are found in amount model");
    }
      

    console.log("started to delete expiredTokens");
    const expiredTokens = await user.find({
      emailVerificationTokenExpires: { $lt: new Date() },
    });
    if (expiredTokens.length > 0) {
      console.log(
        `Deleting ${expiredTokens.length} expired verification tokens`
      );
      for (const token of expiredTokens) {
        await user.findByIdAndDelete(token._id);
      }
    } else {
      console.log("No expired verification tokens found");
    }
  } catch (error) {
    console.error("Error deleting expired verification tokens:", error);
  }
}
//for every hours
// cron.schedule('0 * * * *', deleteExpiredVerificationTokens);
// for daily
cron.schedule("0 0 * * *", deleteExpiredVerificationTokens); 
// for testing every second
// cron.schedule("* * * * *", deleteExpiredVerificationTokens);

const user = new mongoose.model("userCredentials", userSchema);
module.exports = user;
