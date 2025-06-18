
const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
 
  aadharImageUrl: { type: String },
  accountHolderName: { type: String },
  accountNumber: { type: String },
  address: {
    country: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
   },
  agreeAll: { type: Boolean },
  agreePayment: { type: Boolean },
  agreePrivacy: { type: Boolean },
  agreeTerms: { type: Boolean },
  bankName: { type: String },
 campaignTitle: { type: String },
 category: { type: String },
 country: { type: String },
  currency: { type: String },
  dateOfBirth: {
    day: { type: String },
    month: { type: String },
    year: { type: String }
  },
 email: { type: String },
 emailOfImamSahab: { type: String },
 endDate: { type: Date },
 lastName: { type: String },
 featureImage: { type: String, default: null },
  featureImageUrl: { type: String },
 fullNameAsPerAadhar: { type: String },
  fundType: { type: String },
 firstName: { type: String },
 goalAmount: { type: Number },
 governmentIdUrl: { type: String },
 
 supportingDocuments: {
    type: [String],
  },
 supportingDocumentsUrl:{
    type: [String],
  },
 ifscCode: { type: String },
 isBeneficiaryOrphan: { type: String },
 isUrgent: { type: Boolean },
 location: { type: String },
 masjidName: { type: String },
 numberOfBeneficiaries: { type: String },
 numberOfImamSahab: { type: String },
 panImageUrl: { type: String },
 phone: { type: String },
 pincode: { type: String },
 raisingCause: { type: String },
 story: { type: String },
  tagline: { type: String },
 zakatVerified: { type: Boolean },
   status: {
    type: String,
    enum: ['Pending', 'Active', 'Reject', 'Terminate'],
    default: 'Pending'
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
    givenAmount: [
    {
      _id: String,
      amount: Number,
      headline: String,
      subHeadline: String,
    },
  ],
  updates: [
      {
        _id: String,
        story: String,
        videoUrl: String,
        images: [],
      },
    ],
    ranking: { type: Number },
    comments: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        comment: String,
        user:String,
        date: Date,
      },
    ],
    instituteName: { type: String },
    instituteRole: { type: String },
    anticipatedDonations: { type: Number },
    spendingPlans: { type: String }
    
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);
