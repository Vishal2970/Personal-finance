const mongoose = require("mongoose");

const amountModel = new mongoose.Schema({
  amountAdded: {
    type: String,
    required: true,
    minlength: 1,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
  },
  emailID: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    default: () => {
      const now = new Date();
      return now.toISOString().split("T")[0];
    },
  },
  Withdrawal: {
    type: Boolean,
    require: true,
  },
  nameOfTransaction: {
    type: String,
    require: true,
  },
});

const amount = new mongoose.model("Transaction", amountModel);
module.exports = amount;
