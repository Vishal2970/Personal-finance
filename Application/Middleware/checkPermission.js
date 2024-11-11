const jwt = require("jsonwebtoken");
const writeLog = require('../Utility/logger');
//not in use
const isAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[0];

  if (!token) return res.status(403).send("Access denied");
  try {
    const decoded = jwt.verify(token, process.env.SecretKey);
    if (!decoded.isAdmin) {
      return res.status(403).send("Access denied.");
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
  }
};

const isTypeOfUser = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[0]; 
  writeLog(`Entered in middleware isTypeOfUser with token ${token}`) 
  if (!token) return res.status(403).send("Access denied");
  try {
    const decoded = jwt.verify(token, process.env.SecretKey);
    writeLog(`user data is ${decoded}`);
    req.user = decoded;
    next();
  } catch (error) {
    writeLog(`error in middleware isTypeOfUser ${error}`);
    console.log(error);
  }
};
module.exports = { isAdmin, isTypeOfUser };
