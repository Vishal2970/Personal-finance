require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const user = require("../Models/userModel");

const verifyEmail = async (req, res) => {
  try {
    console.log("Hit this url");

    // Extract token from query parameters
    const { token } = req.query;
    console.log(token);

    // Find the user with the matching token and an unexpired token expiry date
    const userdata = await user.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });

    // Check if the token is valid and not expired
    if (!userdata) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Update user's email verification status
    userdata.isEmailVerified = true;
    userdata.emailVerificationToken = undefined; // Clear the token
    userdata.emailVerificationTokenExpires = undefined;

    // Save the changes to the user document
    await userdata.save();

    // Respond with success message
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    // Handle errors and respond with a server error message
    console.error("Error verifying email:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};



// Email verification token expiration (e.g., 1 hour)
const TOKEN_EXPIRATION_TIME = 3600000; // 1 hour in milliseconds

const register = async (req, res) => {
  const { fullName,userName, mobileNumber, emailID, password } = req.body;

  // Validate userName and mobileNumber
  if (userName.length < 3 || userName.length > 20) {
    return res.status(400).json({ message: "Username must be between 3 and 20 characters long." });
  }

  if (!/^\d{10}$/.test(mobileNumber)) {
    return res.status(400).json({ message: "Mobile number must be exactly 10 digits." });
  }

  const userNameExist=await user.findOne({userName});
  if(userNameExist){
    return res.status(400).json({
      message: "User with this userName is already exists",
    });
  }

  const userExist = await user.findOne({
    $or: [{ emailID }, { mobileNumber }],
  });

  if (userExist) {
    return res.status(400).json({
      message: "User with this mobile number or email already exists",
    });
  }

  // Generate a unique verification token
  const verificationToken = crypto.randomBytes(16).toString('hex');

  // Create new user with verification token and status
  const newUser = new user({
    fullName,
    userName,
    mobileNumber,
    emailID,
    password, // Note: Be sure to hash the password with bcrypt before saving
    isEmailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpires: Date.now() + TOKEN_EXPIRATION_TIME,
  });

  try {
    await newUser.save();

    // Send verification email
    sendVerificationEmail(emailID, verificationToken);

    res.status(201).json({ message: "User created successfully. Please verify your email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Helper function to send the verification email
const sendVerificationEmail = (email, token) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Please verify your email by clicking on the link below:</p>
           <a href="http://localhost:5000/api/auth/verify-email?token=${token}">Verify Email</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending verification email:', error);
    } else {
      console.log('Verification email sent:', info.response);
    }
  });
};




const login = async (req, res) => {
  const { userInput, password } = req.body;
  // console.log(`userName ${userInput},emailID ${userInput},password ${password}`);
  if (userInput === undefined) {
    return res.status(400).json({ message: "Please enter user Name or email" });
  }
  const userExist = await user.findOne({$or: [{ emailID: userInput }, { userName: userInput }],});

  if (!userExist) {
    return res.status(400).json({
      message: "User with this email or mobile number not exists",
    });
  }
  if(!userExist.isEmailVerified){
    return res.status(401).json({
      message: "User with this email or mobile number is not verified",
    });
  }
  // console.log(`Retrieved User: ${JSON.stringify(userExist)}`);
  // const hashedPassword = await bcrypt.hash(password, 10);
  const userdetails = await userExist.passwordMatch(password);
  try {
    if (userdetails) {
      // console.log("userdetails",userdetails)
      return res.status(200).json({ message: `Login successfull ${userExist.fullName}`, token: await userExist.generateToken() });
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { register, login, verifyEmail };
