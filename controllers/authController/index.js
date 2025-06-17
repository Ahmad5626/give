const User = require("../../models/User");
const { OAuth2Client } = require("google-auth-library");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = async (req, res) => {
  try {
    const { fullName, userEmail, password, RegisteredType } = req.body;
    if (!fullName || !userEmail || !password ) {
      return res.status(400).send("All fields are required");
    }
    const userExists = await User.findOne({
      $or: [{ userEmail }],
    });
    if (userExists) {
      return res.status(400).send("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      userEmail,
      password: hashedPassword,
      RegisteredType,
      
    });

    await newUser.save();
    return res.status(200).json({
      success: true,
      newUser,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).send(error.message);
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("Invalid password");
    }

    const token = jwt.sign(
      {
        id: user._id,
        fullName: user.fullName,
        userEmail: user.userEmail,
        role: user.role,
        RegisteredType: user.RegisteredType,
        
       
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2000m",
      }
    );
    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user,
      data: {
        token,
        user: {
          _id: user._id,
          fullName: user.fullName,
          userEmail: user.userEmail,
          role: user.role,
        },
      },
    });
  } catch (error) {}
};
const logoutUser = async (req, res) => {
  try {
    const { id } = req.user;

    await User.findByIdAndUpdate(id, { token: "" });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to log out user",
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.user;
const { gender, dateOfBirth, State, Address, Pincode, maritalStatus, mobileNumber, district, PANCardNo,instituteName,
  instituteBio,
  instituteCategory,
  Country,
  websiteUrl,
profileImage } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        gender,
        dateOfBirth,
        State,
        Address,
        Pincode,
        maritalStatus,
        mobileNumber,
        district,
        PANCardNo,
        instituteName,
        instituteBio,
        instituteCategory,
        Country,
        websiteUrl,
        profileImage
      },
      { new: true ,runValidators: true}
    );
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: error.message,
    });
  }
};



const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};

const chekcAuthData =async (req,res)=>{
  try {
    const {id}  = req.user;

    
  const data = await User.findOne({_id:id})
  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    data: data,
  });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: error.message,
    })
  }
}

const deleteUser=async(req,res)=>{
  const id=req.params.id
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: error.message,
    });
  }
}

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET);
const googleLogin = async (req, res) => {
  const token = req.body.token || req.body.credential; // ✅ fallback
  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

   const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    // ✅ Check if user already exists
    let user = await User.findOne({ userEmail: email });

    if (!user) {
      //  Not found → Create with minimum details
      user = await User.create({
        fullName: name,
        userEmail: email,
        password: null, // Google user doesn't need password
        RegisteredType: "google",
        profileImage: picture,
      });
    }
     // ✅ Generate JWT
    const jwtToken = jwt.sign(
  {
    id: user._id,
    fullName: user.fullName,
    userEmail: user.userEmail,
    role: user.role,
    RegisteredType: user.RegisteredType,
  },
  process.env.JWT_SECRET,
  { expiresIn: "2000m" }
);

    res.status(200).json({
      message: "Login successful",
        token: jwtToken,
      user: {
        id: user._id,
        fullName: user.fullName,
        userEmail: user.userEmail,
        profileImage: user.profileImage,
        RegisteredType: user.RegisteredType,
      },
    });
    res.status(200).json({ message: 'Login successful', user: payload });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err.message });
  }
};

const facebookLogin = async (req, res) => {
  const { accessToken } = req.body;

  try {
    // Step 1: Verify token + get user info from Facebook
    const fbRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    const { email, name, picture } = fbRes.data;

    let user = await User.findOne({ userEmail: email });

    if (!user) {
      user = await User.create({
        fullName: name,
        userEmail: email,
        RegisteredType: "facebook",
        profileImage: picture?.data?.url || "",
      });
    }

    const jwtToken2 = jwt.sign(
  {
    id: user._id,
    fullName: user.fullName,
    userEmail: user.userEmail,
    role: user.role,
    RegisteredType: user.RegisteredType,
  },
  process.env.JWT_SECRET,
  { expiresIn: "2000m" }
);

    res.status(200).json({
      message: "Login successful",
        token: jwtToken2,
      user: {
        id: user._id,
        fullName: user.fullName,
        userEmail: user.userEmail,
        profileImage: user.profileImage,
        RegisteredType: user.RegisteredType,
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Facebook login failed", error: err.message });
  }
};
module.exports = { registerUser, loginUser,updateUser,getUsers,deleteUser,chekcAuthData ,googleLogin,facebookLogin};


