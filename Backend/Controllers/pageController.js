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
  let amountAdded = req.body.Amount;
  const emailID = req.user.emailID;
  const Withdrawal = req.body.Withdrawal;
  const nameOfTransaction = req.body.nameOfTransaction;
  
  // console.log("emailID ", emailID);
  if (Withdrawal) {
    console.log("check this Withdrawal in frontend");
    amountAdded = (-Math.abs(amountAdded)).toString();
  }

  console.log("Amount after ", amountAdded);
  const inserting = new amount({
    amountAdded,
    emailID,
    Withdrawal,
    nameOfTransaction,
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
      totalAmount += parseInt(amountFound[i].amountAdded);
    }

    return res.status(200).json({
      message: "Fetched amounts successfully",
      totalAmount: Math.floor(totalAmount),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching data" });
  }
};

const listOfTransactionAdmin = async (req, res) => {
  try {
    const amountList = await amount.find().sort({ emailID: 1 });
    if (amountList.length > 0)
      return res
        .status(200)
        .json({ message: "list fetched successfully", amountList });
    else return res.status(200).json({ message: "No data found", amountList });
  } catch (error) {
    console.log(error);
  }
};

const listOfTransactionNormal = async (req, res) => {
  const emailID = req.user.emailID;
  try {
    const amountList = await amount.find({ emailID }).sort({ amountAdded: 1 });
    if (amountList.length > 0)
      return res
        .status(200)
        .json({ message: "list fetched successfully", amountList });
    else return res.status(200).json({ message: "No data found", amountList });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  pageCheck,
  pageCheckNormal,
  addAmount,
  insertingAmount,
  listOfTransactionAdmin,
  listOfTransactionNormal,
};
