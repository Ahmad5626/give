const Heart = require("../../models/Hearts")

// Get all hearts for a specific user
const getUserHearts = async (req, res) => {
  try {
    const { userId } = req.query

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      })
    }

    const userHearts = await Heart.find({ userId })
      .sort({ createdAt: -1 })
      .select("campaignId userData campaignData timestamp createdAt")

    res.status(200).json({
      success: true,
      data: userHearts,
      count: userHearts.length,
    })
  } catch (error) {
    console.error("Error fetching user hearts:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get all hearts for a specific campaign
const getCampaignHearts = async (req, res) => {
  try {
    const { campaignId } = req.params

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      })
    }

    const campaignHearts = await Heart.find({ campaignId })
      .sort({ createdAt: -1 })
      .select("userId userData timestamp createdAt")

    const heartCount = await Heart.countDocuments({ campaignId })

    res.status(200).json({
      success: true,
      data: campaignHearts,
      count: heartCount,
    })
  } catch (error) {
    console.error("Error fetching campaign hearts:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Add a new heart (like)
const addHeart = async (req, res) => {
  try {
    const { userId, campaignId, userData, campaignData, timestamp } = req.body

    // Validation
    if (!userId || !campaignId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Campaign ID are required",
      })
    }

    if (!userData || !campaignData) {
      return res.status(400).json({
        success: false,
        message: "User data and Campaign data are required",
      })
    }

    // Check if heart already exists
    const existingHeart = await Heart.findOne({ userId, campaignId })

    if (existingHeart) {
      return res.status(409).json({
        success: false,
        message: "Campaign already liked by this user",
        data: existingHeart,
      })
    }

    // Create new heart
    const newHeart = new Heart({
      userId,
      campaignId,
      userData,
      campaignData,
      timestamp: timestamp || new Date().toISOString(),
    })

    const savedHeart = await newHeart.save()

    // Get updated heart count for this campaign
    const heartCount = await Heart.countDocuments({ campaignId })

    res.status(201).json({
      success: true,
      message: "Heart added successfully",
      data: savedHeart,
      heartCount,
    })
  } catch (error) {
    console.error("Error adding heart:", error)

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Campaign already liked by this user",
      })
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Remove a heart (unlike)
const removeHeart = async (req, res) => {
  try {
    const { userId, campaignId } = req.body

    // Validation
    if (!userId || !campaignId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Campaign ID are required",
      })
    }

    // Find and delete the heart
    const deletedHeart = await Heart.findOneAndDelete({ userId, campaignId })

    if (!deletedHeart) {
      return res.status(404).json({
        success: false,
        message: "Heart not found",
      })
    }

    // Get updated heart count for this campaign
    const heartCount = await Heart.countDocuments({ campaignId })

    res.status(200).json({
      success: true,
      message: "Heart removed successfully",
      data: deletedHeart,
      heartCount,
    })
  } catch (error) {
    console.error("Error removing heart:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get heart count for a specific campaign
const getHeartCount = async (req, res) => {
  try {
    const { campaignId } = req.params

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: "Campaign ID is required",
      })
    }

    const heartCount = await Heart.countDocuments({ campaignId })

    res.status(200).json({
      success: true,
      campaignId,
      heartCount,
    })
  } catch (error) {
    console.error("Error getting heart count:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Check if user has liked a specific campaign
const checkUserHeart = async (req, res) => {
  try {
    const { userId, campaignId } = req.query

    if (!userId || !campaignId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Campaign ID are required",
      })
    }

    const heart = await Heart.findOne({ userId, campaignId })

    res.status(200).json({
      success: true,
      isLiked: !!heart,
      data: heart,
    })
  } catch (error) {
    console.error("Error checking user heart:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Get heart statistics
const getHeartStats = async (req, res) => {
  try {
    const totalHearts = await Heart.countDocuments()

    // Get top liked campaigns
    const topCampaigns = await Heart.aggregate([
      {
        $group: {
          _id: "$campaignId",
          heartCount: { $sum: 1 },
          campaignData: { $first: "$campaignData" },
        },
      },
      { $sort: { heartCount: -1 } },
      { $limit: 10 },
    ])

    // Get most active users
    const topUsers = await Heart.aggregate([
      {
        $group: {
          _id: "$userId",
          heartCount: { $sum: 1 },
          userData: { $first: "$userData" },
        },
      },
      { $sort: { heartCount: -1 } },
      { $limit: 10 },
    ])

    res.status(200).json({
      success: true,
      data: {
        totalHearts,
        topCampaigns,
        topUsers,
      },
    })
  } catch (error) {
    console.error("Error getting heart stats:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    })
  }
}

module.exports = {
  getUserHearts,
  getCampaignHearts,
  addHeart,
  removeHeart,
  getHeartCount,
  checkUserHeart,
  getHeartStats,
}
