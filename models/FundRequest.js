const mongoose = require("mongoose");

const FundRequestSchema=new mongoose.Schema({ 
    name: { type: String },
    campaignType: { type: String },
   
  amount: { type: Number },
  accountNumber: { type: Number },
  ifsc: { type: String },
  bankName: { type: String },
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model("FundRequest", FundRequestSchema);