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
  let nameOfTransaction = req.body.nameOfTransaction;

  // console.log("emailID ", emailID);
  if (Withdrawal) {
    console.log("check this Withdrawal in frontend");
    amountAdded = (-Math.abs(amountAdded)).toString();
  }

  console.log("Amount after ", amountAdded);
  if (nameOfTransaction.length < 1) {
    nameOfTransaction = "Random Entry";
  }
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
  const emailID = req.user.emailID;
  try {
    const amountList = req.user.isAdmin
      ? await amount.find().sort({ emailID: 1 })
      : await amount.find({ emailID }).sort({ amountAdded: 1 });
    if (amountList.length > 0)
      return res
        .status(200)
        .json({ message: "list fetched successfully", amountList });
    else return res.status(200).json({ message: "No data found", amountList });
  } catch (error) {
    console.log(error);
  }
};

const deleteParticularEntry = async (req, res) => {
  const emailID = req.user.emailID;
  const id = req.body.id;

  try {
    const deleted = req.user.isAdmin? await amount.deleteOne({ _id: id }): await amount.deleteOne({ _id: id, emailID: emailID });
      if (deleted.deletedCount === 0) {
      return res.status(404).json({ message: "Entry not found" });
    }
    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.log(error);
  }
};

const deleteAllforNormalOnly = async (req, res) => {
  const emailID = req.user.emailID;
  try {
    const deleteAll=req.user.isAdmin?res.status(404).json({ message: "Not Allowed to delete from here" }): await amount.deleteMany({emailID});
    console.log(deleteAll);
    return res.status(200).json({ message: "All Entry deleted successfully" });
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
  deleteParticularEntry,
  deleteAllforNormalOnly,
};
