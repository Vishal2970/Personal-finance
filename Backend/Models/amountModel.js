const mongoose = require('mongoose');

const amountModel=new mongoose.Schema({
    amountAdded:{
        type:String,
        required:true,
        minlength: 1,
    },
    emailID:{
        type:String,
        require:true,
    }
})

const amount=new mongoose.model("Transaction",amountModel);
module.exports=amount;