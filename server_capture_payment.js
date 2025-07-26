require('dotenv').config();

const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: ['https://unitedlearning.in', 'https://www.unitedlearning.in']
}));

app.use(express.json());

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Health check route
app.get('/', (req, res) => {
  res.send('Backend is running.');
});

// Create Razorpay order (required for frontend checkout)
app.post('/create_order', async (req, res) => {
  const { amount } = req.body;
  try {
    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount), // Amount in paise
      currency: 'INR',
      receipt: 'receipt_' + Date.now()
    });
    res.json({ order_id: order.id });
  } catch (err) {
    console.error('Order creation failed:', err);
    res.status(500).json({ error: err.message });
  }
});

// Capture payment after successful checkout
app.post('/server_capture_payment', async (req, res) => {
  const { paymentId, amount } = req.body;
  try {
    const response = await razorpayInstance.payments.capture(paymentId, Math.round(amount));
    console.log('Payment captured:', response);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Capture failed:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});