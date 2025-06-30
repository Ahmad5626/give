const Payment = require("../../models/Payment");

const createPayment = async (req, res) => {
    try {
        const payment =req.body
        const newPayment = new Payment(payment);
        const savedPayment = await newPayment.save();
        res.status(200).json(savedPayment);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = { createPayment };