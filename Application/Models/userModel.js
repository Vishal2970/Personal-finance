const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    return token;
  } catch (error) {
    console.log(error);
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

const user = new mongoose.model("userCredentials", userSchema);
module.exports = user;
