const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: String,
  userEmail: String,
  password: String,
  RegisteredType: String,
  gender : String,
  dateOfBirth: String,
  State: String,
  Address: String,
  Pincode: String,
  maritalStatus: String,
  mobileNumber: String,
  district: String,
  PANCardNo: String,
 instituteName:String,
  instituteBio:String,
  instituteCategory:String,
  Country:String,
  websiteUrl:String,
  profileImage:String,
  RegisteredType: String,
  profileImage: String,
  
});

module.exports = mongoose.model("User", UserSchema);