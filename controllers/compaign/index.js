const Campaign = require('../../models/Campaign');
const Comments = require('../../models/Comments');
const GivenAmount = require('../../models/GivenAmount');
const mongoose = require("mongoose");
const Updates = require('../../models/Updates');
// Create Campaign Controller
const createCampaign = async (req, res) => {
 
  try {
    const {
      aadharImageUrl,
      accountHolderName,
      accountNumber,
      address,
      addressDetails,
      agreeAll,
      agreePayment,
      agreePrivacy,
      agreeTerms,
      bankName,
      beneficiaryDateOfBirth,
      campaignTitle,
      category,
      country,
      currency,
      dateOfBirth,
      district,
      email,
      emailId,
      emailOfImamSahab,
      endDate,
      familyName,
      featureImageUrl,
      fullNameAsPerAadhar,
      fundType,
      gender,
      givenName,
      goalAmount,
      governmentIdUrl,
      ifscCode,
      isBeneficiaryOrphan,
      isUrgent,
      location,
      maritalStatus,
      mobileNumber,
      masjidName,
      numberOfBeneficiaries,
      numberOfImamSahab,
      panImageUrl,
      phone,
      pincode,
      raisingCause,
      state,
      story,
      tagline,
      zakatVerified,
      instituteRole,
      anticipatedDonations,
      spendingPlans ,
      firstName,
      lastName,
      ranking,
      supportingDocuments,
      supportingDocumentsUrl,
      instituteName

    } = req.body;

    const newCampaign = new Campaign({
      aadharImageUrl,
      accountHolderName,
      accountNumber,
      address,
      addressDetails,
      agreeAll,
      agreePayment,
      agreePrivacy,
      agreeTerms,
      bankName,
      beneficiaryDateOfBirth,
      campaignTitle,
      category,
      country,
      currency,
      dateOfBirth,
      district,
      email,
      emailId,
      emailOfImamSahab,
      endDate,
      familyName,
      featureImageUrl,
      fullNameAsPerAadhar,
      fundType,
      gender,
      givenName,
      goalAmount,
      governmentIdUrl,
      ifscCode,
      isBeneficiaryOrphan,
      isUrgent,
      location,
      maritalStatus,
      mobileNumber,
      masjidName,
      numberOfBeneficiaries,
      numberOfImamSahab,
      panImageUrl,
      phone,
      pincode,
      raisingCause,
      state,
      story,
      tagline,
      zakatVerified,
      instituteRole,
      anticipatedDonations,
      spendingPlans,
      firstName,
      lastName,
      ranking,
      supportingDocuments,
      supportingDocumentsUrl,
      instituteName,
      createdBy: req.user.id
    });

    await newCampaign.save();

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: newCampaign,
  
    });
    return newCampaign;
  } catch (error) {
    console.error('Campaign creation error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create campaign',
      error: error.message,
    });
    return error.message;
  }
};

const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({
      success: true,
      message: 'Campaigns fetched successfully',
      data: campaigns,
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns',
      error: error.message,
    });
  }
};

const getLoginUserCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ createdBy: req.user.id });
    res.status(200).json({
      success: true,
      message: 'Campaigns fetched successfully',
      data: campaigns,
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch campaigns',
      error: error.message,
    });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };
    
    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id, 
      updateData,
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: updatedCampaign,
    });
  } catch (error) {
    console.error('Error updating campaign:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update campaign',
      error: error.message,
    });
  }
};
const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCampaign = await Campaign.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully',
      data: deletedCampaign,
    });
  } catch (error) {
    console.error('Error deleting campaign:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete campaign',
      error: error.message,
    });
  }
};

const givenAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { headline, amount, subHeadline } = req.body;

    // Create and save in GivenAmount collection
    const newGivenAmount = new GivenAmount({ headline, amount, subHeadline });
    await newGivenAmount.save();

    // Embed the full data into Campaign
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      {
        $push: {
          givenAmount: {
            _id: newGivenAmount._id,
            headline,
            amount,
            subHeadline,
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'GivenAmount added and embedded successfully',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteGivenAmount = async (req, res) => {
  try {
    const { campaignId, updatesId } = req.params;

    // ✅ Validate IDs
    if (!mongoose.Types.ObjectId.isValid(givenAmountId)) {
      return res.status(400).json({ error: 'Invalid givenAmountId' });
    }

    // ✅ Step 1: Delete the document from GivenAmount collection
    await GivenAmount.findByIdAndDelete(givenAmountId);

    // ✅ Step 2: Pull embedded document by _id
    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      {
        $pull: {
          givenAmount: { _id: new mongoose.Types.ObjectId(givenAmountId) }
        }
      },
      { new: true }
    );

    if (!campaign) {
      console.log("Params:", req.params);
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({
      success: true,
      message: 'GivenAmount deleted from both Campaign and GivenAmount collection',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// new create updates

const craeteUpdates = async (req, res) => {
  try {
    const { id } = req.params;
    const { story, images, videoUrl } = req.body;

    // Create and save in GivenAmount collection
    const newUpdateCreate = new Updates({ story, images, videoUrl });
    await newUpdateCreate.save();

    // Embed the full data into Campaign
    const campaign = await Campaign.findByIdAndUpdate(
      id,
      {
        $push: {
          updates: {
            _id: newUpdateCreate._id,
            story,
            images,
            videoUrl
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Updates added and embedded successfully',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const deleteUpdates = async (req, res) => {
  try {
    const { campaignId, updatesId } = req.params;

    // ✅ Validate IDs
    if (!mongoose.Types.ObjectId.isValid(updatesId)) {
      return res.status(400).json({ error: 'Invalid updatesId' });
    }

    // ✅ Step 1: Delete the document from GivenAmount collection
    await Updates.findByIdAndDelete(updatesId);

    // ✅ Step 2: Pull embedded document by _id
    const campaign = await Campaign.findByIdAndUpdate(
      campaignId,
      {
        $pull: {
          updates: { _id: new mongoose.Types.ObjectId(updatesId) }
        }
      },
      { new: true }
    );

    if (!campaign) {
      console.log("Params:", req.params);
      return res.status(404).json({ error: 'Campaign not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Updates deleted from both Campaign and Updates collection',
      data: campaign,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const commentData = new Comments({ comment });
    await commentData.save();
   

    const campaign = await Campaign.findByIdAndUpdate(
      id,
      {
        $push: {
          comments: {
            _id: commentData._id,
            comment,
           
          },
        },
      },
      { new: true }
    )
    await campaign.save();
    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: commentData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Search campaigns with filters
const searchCampaigns = async (req, res) => {
  try {
    const {
      query,
      category,
      fundType,
      country,
      minAmount,
      maxAmount,
      zakatVerified,
      status = "Active",
      page = 1,
      limit = 12,
    } = req.query

    // Build search query
    const searchQuery = {}

    // Text search across multiple fields
    if (query) {
      searchQuery.$or = [
        { campaignTitle: { $regex: query, $options: "i" } },
        { story: { $regex: query, $options: "i" } },
        { tagline: { $regex: query, $options: "i" } },
        { raisingCause: { $regex: query, $options: "i" } },
      ]
    }

    // Filter by category
    if (category && category !== "all") {
      searchQuery.category = category
    }

    // Filter by fund type
    if (fundType && fundType !== "all") {
      searchQuery.fundType = fundType
    }

    // Filter by country
    if (country && country !== "all") {
      searchQuery.country = country
    }

    // Filter by goal amount range
    if (minAmount || maxAmount) {
      searchQuery.goalAmount = {}
      if (minAmount) searchQuery.goalAmount.$gte = Number.parseInt(minAmount)
      if (maxAmount) searchQuery.goalAmount.$lte = Number.parseInt(maxAmount)
    }

    // Filter by zakat verification
    if (zakatVerified !== undefined && zakatVerified !== "all") {
      searchQuery.zakatVerified = zakatVerified === "true"
    }

    // Filter by status
    if (status && status !== "all") {
      if (Array.isArray(status)) {
        searchQuery.status = { $in: status }
      } else {
        searchQuery.status = status
      }
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute search with pagination
    const campaigns = await Campaign.find(searchQuery)
      .populate("createdBy", "fullName instituteName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit))

    // Get total count for pagination
    const totalCampaigns = await Campaign.countDocuments(searchQuery)

    // Calculate additional data for each campaign
    const campaignsWithData = campaigns.map((campaign) => {
      const totalFunded = campaign.givenAmount.reduce((sum, donation) => sum + donation.amount, 0)
      const daysLeft = Math.max(Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24)), 0)

      return {
        ...campaign.toObject(),
        totalFunded,
        daysLeft,
        donorCount: campaign.givenAmount.length,
        fundingPercentage: Math.min((totalFunded / campaign.goalAmount) * 100, 100),
      }
    })

    res.json({
      success: true,
      campaigns: campaignsWithData,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages: Math.ceil(totalCampaigns / limit),
        totalCampaigns,
        hasNext: page * limit < totalCampaigns,
        hasPrev: page > 1,
      },
      filters: {
        query: query || "",
        category: category || "all",
        fundType: fundType || "all",
        country: country || "all",
        minAmount: minAmount || 0,
        maxAmount: maxAmount || 1000000,
        zakatVerified: zakatVerified || "all",
        status: status || "Active",
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    res.status(500).json({
      success: false,
      message: "Error searching campaigns",
      error: error.message,
    })
  }
}

// Get filter options (unique values for dropdowns)
const getFilterOptions = async (req, res) => {
  try {
    const categories = await Campaign.distinct("category")
    const fundTypes = await Campaign.distinct("fundType")
    const countries = await Campaign.distinct("country")

    // Get min and max goal amounts
    const amountRange = await Campaign.aggregate([
      {
        $group: {
          _id: null,
          minAmount: { $min: "$goalAmount" },
          maxAmount: { $max: "$goalAmount" },
        },
      },
    ])

    res.json({
      success: true,
      filterOptions: {
        categories: categories.filter(Boolean),
        fundTypes: fundTypes.filter(Boolean),
        countries: countries.filter(Boolean),
        amountRange: amountRange[0] || { minAmount: 0, maxAmount: 1000000 },
        statuses: ["Active", "Pending", "Reject", "Terminate"],
      },
    })
  } catch (error) {
    console.error("Filter options error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching filter options",
      error: error.message,
    })
  }
}
module.exports = {
  createCampaign,
  getAllCampaigns,
  getLoginUserCampaigns,
  updateCampaign,
  deleteCampaign,
  givenAmount,
  deleteGivenAmount,
  createComment,
  searchCampaigns,
  getFilterOptions,
  craeteUpdates,
  deleteUpdates
};