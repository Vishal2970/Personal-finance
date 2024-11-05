const amount = require("../Models/amountModel");
//check for admin
const pageCheck = async (req, res) => {
  return res.status(200).json({
    message: "Page is checked for admin successfully",
  });
};

//check for normal
const pageCheckNormal = async (req, res) => {
  return res.status(200).json({
    message: "Page is checked for Normal successfully",
  });
};

//adding inserting
const insertingAmount = async (req, res) => {
  const amountAdded = req.body.Amount;
  const emailID = req.user.emailID;
  console.log("Amount ", amountAdded);
  console.log("emailID ", emailID);

  const inserting = new amount({
    amountAdded,
    emailID,
  });
  try {
    await inserting.save();
    return res.status(200).json({ message: "inserted" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Not inserted" });
  }
};

const addAmount = async (req, res) => {
  const emailID = req.user.emailID;
  try {
    const amountFound = await amount.find({ emailID: emailID });

    if (amountFound.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this email ID." });
    }
    let totalAmount = 0;
    for (let i = 0; i < amountFound.length; i++) {
      console.log("amountFound.length", amountFound[i].amountAdded);
      totalAmount += parseInt(amountFound[i].amountAdded);
    }

    return res
      .status(200)
      .json({
        message: "Fetched amounts successfully",
        totalAmount: Math.floor(totalAmount),
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching data" });
  }
};

module.exports = { pageCheck, pageCheckNormal, addAmount, insertingAmount };
