const mongoose = require("mongoose");

const amountModel = new mongoose.Schema({
  amountAdded: {
    type: String,
    required: true,
    minlength: 1,
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
});

const amount = new mongoose.model("Transaction", amountModel);
module.exports = amount;
