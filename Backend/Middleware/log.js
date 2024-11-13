const writeLog = require("../Utility/logger");

const logInApis = (req, res, next) => {
  const { userInput, password } = req.body;
  const path = req.path;
  if (userInput !== undefined && password !== undefined) {
    writeLog(`User Name ${userInput} and password ${password}`);
    writeLog(`path of url ${path}`);
    console.log(userInput);
    console.log(password);
  }
  if (req.rawHeaders[1] !== undefined) {
    console.log("Token :",req.rawHeaders[1]);
  }
  if(req.body){
    console.log("Body :",req.body);
  }
  next();
};
module.exports = logInApis;
