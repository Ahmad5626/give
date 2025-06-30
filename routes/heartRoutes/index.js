const express = require("express")
const router = express.Router()
const {
  getUserHearts,
  getCampaignHearts,
  addHeart,
  removeHeart,
  getHeartCount,
  checkUserHeart,
  getHeartStats,
} = require("../../controllers/hearts")

// GET routes
router.get("/user", getUserHearts) // GET /api/hearts/user?userId=123
router.get("/campaign/:campaignId", getCampaignHearts) // GET /api/hearts/campaign/123
router.get("/count/:campaignId", getHeartCount) // GET /api/hearts/count/123
router.get("/check", checkUserHeart) // GET /api/hearts/check?userId=123&campaignId=456
router.get("/stats", getHeartStats) // GET /api/hearts/stats

// POST routes
router.post("/", addHeart) // POST /api/hearts

// DELETE routes
router.delete("/", removeHeart) // DELETE /api/hearts

module.exports = router
