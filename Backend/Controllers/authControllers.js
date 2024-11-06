const user = require("../Models/userModel");

const register = async (req, res) => {
  const { userName, mobileNumber, emailID, password } = req.body;
  // Validate userName and mobileNumber
  if (userName.length < 3 || userName.length > 20) {
    return res
      .status(400)
      .json({ message: "Username must be between 3 and 20 characters long." });
  }

  if (!/^\d{10}$/.test(mobileNumber)) {
    return res
      .status(400)
      .json({ message: "Mobile number must be exactly 10 digits." });
  }

  const userExist = await user.findOne({
    $or: [{ emailID }, { mobileNumber }],
  });

  if (userExist) {
    return res.status(400).json({
      message: "User with this email or mobile number already exists",
    });
  }

  //const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await new user({
    userName,
    mobileNumber,
    emailID,
    password,
  });

  // Save the new user
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const login = async (req, res) => {
  const { userInput, password } = req.body;
  // console.log(
  //   `userName ${userInput},emailID ${userInput},password ${password}`
  // );
  if (userInput === undefined) {
    return res.status(400).json({ message: "Please user Name or email" });
  }
  const userExist = await user.findOne({
    $or: [{ emailID: userInput }, { userName: userInput }],
  });
  if (!userExist) {
    return res.status(400).json({
      message: "User with this email or mobile number already exists",
    });
  }

//   console.log(`Retrieved User: ${JSON.stringify(userExist)}`);
  // const hashedPassword = await bcrypt.hash(password, 10);
  const userdetails = await userExist.passwordMatch(password);
  try {
    if (userdetails) {
      res.status(200).json({ token: await userExist.generateToken()});
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { register, login };
