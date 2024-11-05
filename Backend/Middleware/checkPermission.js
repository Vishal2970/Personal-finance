const jwt = require("jsonwebtoken");

//not in use
const isAdmin = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[0];

  if (!token) return res.status(403).send("Access denied");
  try {
    const decoded = jwt.verify(token, process.env.SecretKey,);
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
  
    if (!token) return res.status(403).send("Access denied");
    try {
      const decoded = jwt.verify(token, process.env.SecretKey,);
      req.user = decoded;
      next();
    } catch (error) {
      console.log(error);
    }
  };
module.exports = { isAdmin ,isTypeOfUser};
