const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Replace with environment variables in production
const razorpayInstance = new Razorpay({
  key_id: 'rzp_live_fn4tJyW5DakjWy',
  key_secret: 'yhJHiQYnANwqWyRCqQevkpBaI' // Corrected key_secret based on common Razorpay key formats
});

// 📁 Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// ✅ Root route serves the homepage (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 🟢 New: Status check route
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'Backend is active', timestamp: new Date().toISOString() });
});

// 🔁 Razorpay capture route
app.post('/server_capture_payment', async (req, res) => {
  const { paymentId, amount } = req.body;

  try {
    // Ensure amount is in the smallest currency unit (e.g., paise for INR)
    // Razorpay expects amount in integer paise, so convert if it's in rupees (e.g., 100.00 -> 10000)
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    const response = await razorpayInstance.payments.capture(paymentId, amountInPaise);
    console.log('Payment captured:', response);
    res.status(200).json({ success: true, data: response });
  } catch (error) {
    console.error('Capture failed:', error);
    // Provide a more detailed error message if possible
    res.status(500).json({ success: false, error: error.message, details: error.description || 'An unknown error occurred during capture.' });
  }
});

// 🚀 Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
