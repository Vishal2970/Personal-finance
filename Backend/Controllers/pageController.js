const amount = require("../Models/amountModel");
const writeLog = require('../Utility/logger');
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
  writeLog(`${emailID} started inserting data in table`);
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
    amountAdded,
    emailID,
    Withdrawal,
    nameOfTransaction,
  });
  writeLog(`trying to insert : ${inserting}`);
  try {
    await inserting.save();
    writeLog(`inserted sucessfully`);
    return res.status(200).json({ message: "Inserted sucessfully" });
  } catch (error) {
    writeLog(`Error in insertingAmount ${error}`);
    return res.status(400).json({ message: "Not inserted" });
  }
};

const addAmount = async (req, res) => {
  const emailID = req.user.emailID;
  writeLog(`started adding amount for ${emailID} and check here  ${req.user.fullName}`);
  try {
    const amountFound = await amount.find({ emailID: emailID });
    writeLog(`amount : ${amountFound}`)
    if (amountFound.length === 0) {
      return res
        .status(200)
        .json({ message: `No records found for ${req.user.userName}.` });
    }
    let totalAmount = 0;
    for (let i = 0; i < amountFound.length; i++) {
      totalAmount += parseInt(amountFound[i].amountAdded);
    }
    writeLog(`totalAmount ${totalAmount}`);
    return res.status(200).json({
      message: "Fetched amounts successfully",
      totalAmount: Math.floor(totalAmount),
    });
  } catch (error) {
    writeLog(`error in addAmount ${error}`)
    // console.error(error);
    return res.status(500).json({ message: "Error fetching data" });
  }
};

const listOfTransactionAdmin = async (req, res) => {
  const emailID = req.user.emailID;
  writeLog(`Started searching list Of Transaction for ${emailID}`)
  try {
    const amountList = req.user.isAdmin ? await amount.find().sort({ emailID: 1 }) : await amount.find({ emailID }).sort({ amountAdded: 1 });
    writeLog(`list Of Transaction : ${amountList}`);
    if (amountList.length > 0)
      return res.status(200).json({ message: "list fetched successfully", amountList });
    else return res.status(200).json({ message: "No transactions found.", amountList });
  } catch (error) {
    writeLog(`error in listOfTransactionAdmin ${error}`)
    //console.log(error);
  }
};

const deleteParticularEntry = async (req, res) => {
  const emailID = req.user.emailID;
  const id = req.body.id;
  writeLog(`started to delete Particular Entry for ${emailID} with  id ${id}`)
  try {
    const deleted = req.user.isAdmin ? await amount.deleteOne({ _id: id }): await amount.deleteOne({ _id: id, emailID: emailID });
    if (deleted.deletedCount === 0) {
      writeLog(`Entry not found for ${emailID} and id :${id}`);
      return res.status(404).json({ message: "Entry not found" });
    }
    writeLog(`Entry deleted successfully for ${emailID} and id :${id}`);
    return res.status(200).json({ message: "Entry deleted successfully" });
  } catch (error) {
    writeLog(`error in deleteParticularEntry ${error}`);
    //console.log(error);
  }
};

const deleteAllforNormalOnly = async (req, res) => {
  const emailID = req.user.emailID;
  writeLog(`started delete all data for ${emailID}`)
  try {
    const deleteAll = req.user.isAdmin ? res.status(404).json({ message: "Not Allowed to delete from here" }) : await amount.deleteMany({ emailID });
    writeLog(`deleted all ${deleteAll}`);
    //console.log(deleteAll);
    return res.status(200).json({ message: "All Entry deleted successfully" });
  } catch (error) {
    writeLog(`error in deleteAllforNormalOnly ${error}`);
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
