const Campaign = require('../../models/Campaign');
const Comments = require('../../models/Comments');
const GivenAmount = require('../../models/GivenAmount');
const mongoose = require("mongoose");
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
    const { campaignId, givenAmountId } = req.params;

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
module.exports = {
  createCampaign,
  getAllCampaigns,
  getLoginUserCampaigns,
  updateCampaign,
  deleteCampaign,
  givenAmount,
  deleteGivenAmount,
  createComment
};