const amount = require("../Models/amountModel");
// const writeLog = require("../Utility/logger");
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
  const emailID = req.user.emailID;
  console.log(`${emailID} started inserting data in table`);
  let amountAdded = req.body.Amount;
  let nameOfTransaction = req.body.nameOfTransaction;
  const Withdrawal = req.body.Withdrawal;

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
    userName:req.user.userName,
    amountAdded,
    emailID,
    Withdrawal,
    nameOfTransaction,
  });
  console.log(`trying to insert : ${inserting}`);
  try {
    await inserting.save();
    console.log(`inserted sucessfully`);
    return res.status(200).json({ message: "Inserted sucessfully" });
  } catch (error) {
    console.log(`Error in insertingAmount ${error}`);
    return res.status(400).json({ message: "Not inserted" });
  }
};

const addAmount = async (req, res) => {
  const emailID = req.user.emailID;
  console.log(`started adding amount for ${emailID} and check here  ${req.user.fullName}`);
  try {
    const amountFound = await amount.find({ emailID: emailID });
    console.log(`amount : ${amountFound}`)
    if (amountFound.length === 0) {
      return res
        .status(200)
        .json({ message: `No records found for ${req.user.userName}.` });
    }
    let totalAmount = 0;
    for (let i = 0; i < amountFound.length; i++) {
      totalAmount += parseInt(amountFound[i].amountAdded);
    }
    console.log(`totalAmount ${totalAmount}`);
    return res.status(200).json({
      message: "Fetched amounts successfully",
      totalAmount: Math.floor(totalAmount),
    });
  } catch (error) {
    console.log(`error in addAmount ${error}`)
    // console.error(error);
    return res.status(500).json({ message: "Error fetching data" });
  }
};

const listOfTransactionAdmin = async (req, res) => {
  const emailID = req.user.emailID;
  console.log(`Started searching list Of Transaction for ${emailID}`);
  try {
    const amountList = req.user.isAdmin ? await amount.find().sort({ emailID: 1 }) : await amount.find({ emailID }).sort({ amountAdded: 1 });
    console.log(`list Of Transaction : ${amountList}`);
    if (amountList.length > 0) {
      console.log("amountList", amountList);

      return res
        .status(200)
        .json({ message: "list fetched successfully", amountList });
    } else
      return res
        .status(200)
        .json({ message: "No transactions found.", amountList });
  } catch (error) {
    console.log(`error in listOfTransactionAdmin ${error}`);
    //console.log(error);
  }
};

const deleteParticularEntry = async (req, res) => {
  const emailID = req.user.emailID;
  const id = req.body.id;
  console.log(`started to delete Particular Entry for ${emailID} with  id ${id}`);
  try {
    const deleted = req.user.isAdmin
      ? await amount.deleteOne({ _id: id })
      : await amount.deleteOne({ _id: id, emailID: emailID });
    if (deleted.deletedCount === 0) {
      console.log(`Entry not found for ${emailID} and id :${id}`);
      return res.status(404).json({ message: "Entry not found" });
    }
    console.log(`Entry deleted successfully for ${emailID} and id :${id}`);
    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.log(`error in deleteParticularEntry ${error}`);
    //console.log(error);
  }
};

const deleteAllforNormalOnly = async (req, res) => {
  const emailID = req.user.emailID;
  console.log(`started delete all data for ${emailID}`);
  try {
    const deleteAll = req.user.isAdmin
      ? res.status(404).json({ message: "Not Allowed to delete from here" })
      : await amount.deleteMany({ emailID });
      console.log(`deleted all ${deleteAll}`);
    //console.log(deleteAll);
    return res.status(200).json({ message: "All Entry deleted successfully" });
  } catch (error) {
    console.log(`error in deleteAllforNormalOnly ${error}`);
    //console.log(error);
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
