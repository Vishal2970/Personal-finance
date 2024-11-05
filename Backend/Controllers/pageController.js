const pageCheck = async (req, res) => {
  return res.status(200).json({
    message: "Page is checked for admin successfully",
  });
};

const pageCheckNormal = async (req, res) => {
    return res.status(200).json({
      message: "Page is checked for Normal successfully",
    });
  };




module.exports = { pageCheck,pageCheckNormal };
