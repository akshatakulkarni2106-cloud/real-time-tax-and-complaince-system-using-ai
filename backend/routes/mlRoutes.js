const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/predict', async (req, res) => {
  try {
    console.log('📊 ML Predict request received:', req.body);

    const response = await axios.post('http://127.0.0.1:5001/predict', req.body);
    
    console.log('✅ ML Prediction result:', response.data);
    res.json(response.data);

  } catch (error) {
    console.error('❌ ML Service Error:', error.message);
    res.status(500).json({ 
      error: 'ML Service not reachable. Make sure Flask is running on port 5001.' 
    });
  }
});

router.get('/health', async (req, res) => {
  try {
    const response = await axios.get('http://127.0.0.1:5001/health');
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ 
      error: 'ML Service is not running!' 
    });
  }
});

module.exports = router;
