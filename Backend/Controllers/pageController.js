const pageCheck = async (req, res) => {
  return res.status(200).json({
    message: "Page is checked for admin successfully",
  });
};
module.exports = { pageCheck };
