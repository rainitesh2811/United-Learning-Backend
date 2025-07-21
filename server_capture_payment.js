const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // For loading .env variables in production

const app = express();

// ✅ Use CORS securely
app.use(cors({
  origin: 'https://unitedlearning.in'
}));

// ✅ Body parser
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Razorpay instance using environment variables
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Backend is running.');
});

// 🔁 Capture payment
app.post('/server_capture_payment', async (req, res) => {
  const { paymentId, amount } = req.body;

  if (!paymentId || !amount) {
    return res.status(400).json({ success: false, error: 'Payment ID and amount are required' });
  }

  try {
    const response = await razorpayInstance.payments.capture(paymentId, amount);
    console.log('✅ Payment captured:', response);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('❌ Capture failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🚀 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
