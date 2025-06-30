const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    status: { type: String },
    donarName: { type: String },
    amount: { type: Number },
    phone: { type: Number },
    fundType: { type: String },
    compaignName: { type: String },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Payment", PaymentSchema);