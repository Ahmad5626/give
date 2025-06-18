const FundRequest = require("../../models/FundRequest");

const createFundRequest = async (req, res) => {

    const {name,campaignType,amount,accountNumber,ifsc,bankName}=req.body;
    try {
      const newFundRequest = await FundRequest.create({
        name,
        campaignType,
        amount,
        accountNumber,
        ifsc,
        bankName,
      });
     
      res.status(200).json({
        success: true,
        message: "Fund request created successfully",
        data: newFundRequest,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to create fund request",
        error: error.message,
      });
    }
}
const deleteFundRequest = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedFundRequest = await FundRequest.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Fund request deleted successfully",
        data: deletedFundRequest,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete fund request",
        error: error.message,
      });
    }
}
const getFundRequests = async (req, res) => {
    try {
      const fundRequests = await FundRequest.find();
      res.status(200).json({
        success: true,
        message: "Fund requests fetched successfully",
        data: fundRequests,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch fund requests",
        error: error.message,
      });
    }
}
module.exports={createFundRequest,deleteFundRequest,getFundRequests}