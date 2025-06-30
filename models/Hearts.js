
const mongoose = require('mongoose');

const heartSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    campaignId: {
      type: String,
      required: true,
      index: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    campaignData: {
      type: Object,
      required: true,
    },
    timestamp: {
      type: String,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt automatically
  },
)

// Create compound index to prevent duplicate likes
heartSchema.index({ userId: 1, campaignId: 1 }, { unique: true })

// Create additional indexes for better query performance
heartSchema.index({ userId: 1 })
heartSchema.index({ campaignId: 1 })
heartSchema.index({ createdAt: -1 })

const Heart = mongoose.model("Heart", heartSchema)

module.exports = Heart
