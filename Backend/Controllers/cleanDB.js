const mailSendingStatus = require("../Models/sendedEmail");
const amountModel = require("../Models/amountModel");
const user=require("../Models/userModel");

async function deleteExpiredVerificationTokens() {
    console.log("Started running crons ");
  
    try {
      console.log("started to delete sending mails");
  
      const mailSendingEmails = await mailSendingStatus.distinct("emailID");
      const userEmails = await user.distinct("emailID");
      const emailsToDelete = mailSendingEmails.filter((email) => !userEmails.includes(email));
      if (emailsToDelete.length > 0) {
        console.log("emailsToDelete from mailSendingEmails");
        console.log(emailsToDelete);
        await mailSendingStatus.deleteMany({ emailID: { $in: emailsToDelete } });
      } else {
        console.log("no emails to delete are found in mail Sending Emails model");
      }
  
      console.log("started to delete amount added");
      const amountEmails = await amountModel.distinct("emailID");
      const emailToDeleteFromAmount=amountEmails.filter((email)=>!userEmails.includes(email));
      if(emailToDeleteFromAmount.length>0){
        console.log("emailsToDelete from amountModel");
        console.log(emailToDeleteFromAmount);
        await amountModel.deleteMany({ emailID: { $in: emailToDeleteFromAmount } });
      }else{
        console.log("no emails to delete are found in amount model");
      }
        
  
      console.log("started to delete expiredTokens");
      const expiredTokens = await user.find({
        emailVerificationTokenExpires: { $lt: new Date() },
      });
      if (expiredTokens.length > 0) {
        console.log(
          `Deleting ${expiredTokens.length} expired verification tokens`
        );
        for (const token of expiredTokens) {
          await user.findByIdAndDelete(token._id);
        }
      } else {
        console.log("No expired verification tokens found");
      }
    } catch (error) {
      console.error("Error deleting expired verification tokens:", error);
    }
  }

  module.exports = deleteExpiredVerificationTokens; 