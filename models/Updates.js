const mongoose = require("mongoose");

const UpdatesSchema=new mongoose.Schema({ 
  story: { type: Number },
  images: { type: String },
  videoUrl: { type: String },
  
})

module.exports = mongoose.model("Updates", UpdatesSchema);