require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
const cors = require('cors');

// const allowedOrigins = [
//   process.env.CLIENT_URL?.replace(/\/$/, ""),
//   process.env.ADMIN_URL?.replace(/\/$/, "")
// ];
const allowedOrigins =['giveummah-nu.vercel.app', 'grade-topperdashboard-z4gy.vercel.app']
const port = process.env.PORT || 3000;
app.use(cors({
  origin: function (origin, callback) {
  console.log("Origin:", origin); // helpful log
  if (!origin || allowedOrigins.includes(origin)) {
    callback(null, true);
  } else {
    callback(new Error("Not allowed by CORS"));
  }
},
  
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true  }));


// db connection
const connectDB = require('./config/db');
const { connection } = require('mongoose');

const authRoute = require('./routes/authRoutes');
const campaignRoute = require('./routes/campaign');
const buttonsRoute = require('./routes/buttons');
const inspiringInstitutesRoute = require('./routes/inspiringInstitutes');
const recommendedCausesRoute = require('./routes/recommendedCauses');
connectDB();

// Serve static images
app.use("/images", express.static(path.join(__dirname, "public/images")));
// Use the upload route
const uploadRoutes = require("./routes/upload");
app.use("/api", uploadRoutes);

// route configration
app.use("/auth", authRoute);
app.use("/v1/api", campaignRoute);
app.use("/v1/api/buttons", buttonsRoute);
app.use("/v1/api/inspiringInstitutes", inspiringInstitutesRoute);
app.use("/v1/api/recommendedCauses", recommendedCausesRoute);


app.use((error,req,res,next)=>{
console.log(error);
res.status(500).send(error.message);

})
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

// app.use(cors(corsOptions));
// 
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));