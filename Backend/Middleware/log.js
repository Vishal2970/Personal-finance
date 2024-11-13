const writeLog = require('../Utility/logger');

const logInApis=(req,res,next)=>{
    const {userInput,password}=req.body
    const path =req.path;
    writeLog(`User Name ${userInput} and password ${password}`)
    writeLog(`path of url ${path}`)
    console.log(userInput);
    console.log(password);
    console.log(path);

    next();    
}
module.exports = logInApis;
