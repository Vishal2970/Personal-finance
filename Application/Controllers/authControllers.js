require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const user = require("../Models/userModel");
const writeLog = require('../Utility/logger');

const verifyEmail = async (req, res) => {
  writeLog("started verifying email");
  try {
    // Extract token from query parameters
    const { token } = req.query;
    console.log(token);

    // Find the user with the matching token and an unexpired token expiry date
    const userdata = await user.findOne({
      emailVerificationToken: token,
      emailVerificationTokenExpires: { $gt: Date.now() },
    });
    if (userdata) {
      writeLog(`verified  ${userdata.fullName}`);
    }

    // Check if the token is valid and not expired
    if (!userdata) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Update user's email verification status
    userdata.isEmailVerified = true;
    userdata.emailVerificationToken = undefined; // Clear the token
    userdata.emailVerificationTokenExpires = undefined;

    // Save the changes to the user document
    const saved= await userdata.save();
    if(saved){
    writeLog(`verified  ${saved.fullName} email`)
    }
    // Respond with success message
    res.status(200).json({ message: "Email verified successfully!" });
  } catch (error) {
    writeLog(`Error verifying email:${error}`)
    //console.error("Error verifying email:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};



// Email verification token expiration (e.g., 1 hour)
const TOKEN_EXPIRATION_TIME = 3600000; // 1 hour in milliseconds

const register = async (req, res) => {
  const { fullName,userName, mobileNumber, emailID, password } = req.body;
  writeLog(`user with ${fullName} , ${userName},${mobileNumber},${emailID} & ${password} started register`);

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
    password, 
    isEmailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpires: Date.now() + TOKEN_EXPIRATION_TIME,
  });

  try {
    const savedUser=await newUser.save();
    if(savedUser){
      writeLog(`user with ${savedUser.fullName} is saved `);
    }
    // Send verification email
    sendVerificationEmail(emailID, verificationToken,fullName);
    writeLog(`User created successfully for email id: ${emailID} and password: ${password} `);
    return res.status(201).json({ message: "User created successfully. Please verify your email." });
  } catch (error) {
    writeLog(`Error in register ${error}`);
    // console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Helper function to send the verification email
const sendVerificationEmail = (email, token,fullName) => {
  writeLog(`verification sending start for email ${email} and username ${fullName} of token ${token}`)
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
    html: `<p>Hi ${fullName},
    <p>Please verify your email by clicking on the link below:</p>
           <a href="http://localhost:5000/api/auth/verify-email?token=${token}">Verify Email</a>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      writeLog(`'Error sending verification email: ${error}`)
      //console.error('Error sending verification email:', error);
    } else {
      writeLog(`'Verification email sent: ${info.response}`)
      // console.log('Verification email sent:', info.response);
    }
  });
};




const login = async (req, res) => {
  const { userInput, password } = req.body;
  writeLog(`userInput ${userInput},password ${password} started login`);
  if (userInput === undefined) {
    return res.status(400).json({ message: "Please enter user Name or email" });
  }
  const userExist = await user.findOne({$or: [{ emailID: userInput }, { userName: userInput }],});
  
  if (!userExist) {
    writeLog(`user is not exist`)
    return res.status(400).json({
      message: "User with this email or mobile number not exists",
    });
  }
  if(!userExist.isEmailVerified){
    writeLog(`user with this email :${userExist.emailID} is not verified`)
    return res.status(401).json({
      message: "User with this email or mobile number is not verified",
    });
  }
  // console.log(`Retrieved User: ${JSON.stringify(userExist)}`);
  // const hashedPassword = await bcrypt.hash(password, 10);
  const userdetails = await userExist.passwordMatch(password);
  try {
    if (userdetails) {
      writeLog(`login successfull for ${userExist.emailID}`);
      return res.status(200).json({ message: `Login successfull ${userExist.fullName}`, token: await userExist.generateToken() });
    }else{
      writeLog(`Invalid Password for ${userExist.emailID}`);
      return res.status(401).json({ message: "Invalid Password" });
    }
  } catch (error) {
    writeLog(`Error in login ${error}`);
    return error;
  }
};

module.exports = { register, login, verifyEmail };
