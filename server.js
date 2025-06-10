require('dotenv').config();
const express = require('express');
const path = require("path");
const app = express();
const cors = require('cors');
const { createHash } = require('crypto');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
// const allowedOrigins = [
//   process.env.CLIENT_URL,
//   process.env.ADMIN_URL
// ];
const allowedOrigins = [
  'https://giveummah-nu.vercel.app',
  'https://grade-topperdashboard-z4gy.vercel.app'
];
const port = process.env.PORT || 3000;
app.use(cors({
  origin: function (origin, callback) {
    console.log("Origin:", origin);
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


const {
  PHONEPE_MERCHANT_ID,
  PHONEPE_SALT_KEY,
  PHONEPE_SALT_INDEX,
  PHONEPE_PAY_URL,
} = process.env;
function generateChecksum(base64Req, endpoint) {
  const raw = base64Req + endpoint + PHONEPE_SALT_KEY;
  const hash = createHash('sha256').update(raw).digest('hex');
  return `${hash}###${PHONEPE_SALT_INDEX}`;
}

app.post('/api/payment', async (req, res) => {
  try {
    const orderId = uuidv4();
    const merchantTx = `MTX-${Date.now()}`;

    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId: merchantTx,
      merchantUserId: `USER-${uuidv4()}`,
      amount: req.body.amount * 100,
      merchantOrderId: orderId,
      redirectUrl: req.body.redirectUrl,
      callbackUrl: req.body.callbackUrl,
      redirectMode: "POST",
      paymentInstrument: { type: "PAY_PAGE" }
    };

    const json = JSON.stringify(payload);
    const base64Req = Buffer.from(json).toString('base64');
    const checksum = generateChecksum(base64Req, '/pg/v1/pay');

    const response = await axios.post(
      PHONEPE_PAY_URL,
      { request: base64Req },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum
        }
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
});

app.get('/api/status/:merchantTx', async (req, res) => {
  try {
    const url = `${process.env.PHONEPE_STATUS_URL}/${PHONEPE_MERCHANT_ID}/${req.params.merchantTx}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Status fetch failed' });
  }
});

app.use((error,req,res,next)=>{
console.log(error);
res.status(500).send(error.message);

})
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  
});

