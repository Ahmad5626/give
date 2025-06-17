const express= require('express');
const router= express.Router();
const { createCampaign, getAllCampaigns, getLoginUserCampaigns, updateCampaign, deleteCampaign, givenAmount, deleteGivenAmount, createComment, searchCampaigns, getFilterOptions, craeteUpdates, deleteUpdates } = require('../../controllers/compaign/index');
const { authenticate } = require('../../middleware/auth-middleware');


router.post("/create-campaign",authenticate,  createCampaign);
router.get("/get-all-campaigns",  getAllCampaigns);
router.get("/get-login-user-campaigns", authenticate, getLoginUserCampaigns);
router.put("/update-campaigns/:id",  updateCampaign);
router.delete("/delete-campaigns/:id",  deleteCampaign);
router.post("/given-amount/:id",  givenAmount);
router.delete("/delete-given-amount/:campaignId/:givenAmountId",  deleteGivenAmount);

router.post("/create-updates/:id",  craeteUpdates);
router.delete("/delete-updates/:campaignId/:updatesId",  deleteUpdates);
router.post("/create-comment/:id",  createComment);
router.get("/search", searchCampaigns);
// Get filter options
router.get("/filter-options", getFilterOptions)
// router.get("/get-single-campaign/:id", authenticate, getSingleCampaign);
// router.put("/update-campaign/:id", authenticate, updateCampaign);
// router.delete("/delete-campaign/:id", authenticate, deleteCampaign);

module.exports= router