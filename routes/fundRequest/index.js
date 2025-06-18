const express = require("express");
const { createFundRequest, getFundRequests, deleteFundRequest } = require("../../controllers/fundRequest");
const router = express.Router();


router.post("/create-fund-request", createFundRequest);
router.get("/get-fund-requests", getFundRequests);

router.delete("/delete-fund-request/:id", deleteFundRequest);

module.exports = router