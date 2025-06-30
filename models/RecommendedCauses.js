const mongoose = require("mongoose");

const RecommendedCausesSchema = new mongoose.Schema({
 headline: { type: String },
 category: { type: String },
 pageHeadline: { type: String },
 pageSubHeadline: { type: String },
 pageCta: { type: String },
 pageImage: { type: String },
 
 
});

module.exports = mongoose.model("RecommendedCauses", RecommendedCausesSchema);