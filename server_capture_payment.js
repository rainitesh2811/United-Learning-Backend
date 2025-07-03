const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors({
  origin: 'https://united-learning-frontend.vercel.app/'
}));

app.use(express.json());

// 🔐 Replace with environment variables in production
const razorpayInstance = new Razorpay({
  key_id: 'rzp_live_fn4tJyW5DakjWy',
  key_secret: 'yhJHiQYnANwqWyRCqevkpBaI'
});

// ✅ Root route returns a simple message
app.get('/', (req, res) => {
  res.send('Backend is running.');
});

// 🔁 Razorpay capture route
app.post('/server_capture_payment', async (req, res) => {
  const { paymentId, amount } = req.body;

  try {
    const response = await razorpayInstance.payments.capture(paymentId, amount);
    console.log('Payment captured:', response);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Capture failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
