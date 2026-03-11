const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

router.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
});

router.put('/', auth, async (req, res) => {
  const { name, businessType, income, state, gstRegistered, apiKey } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, businessType, income, state, gstRegistered, apiKey },
    { new: true }
  ).select('-password');
  res.json(user);
});

router.put('/picture', auth, async (req, res) => {
  console.log('📸 /picture route hit');
  console.log('Body keys:', Object.keys(req.body));
  console.log('profilePicture length:', req.body.profilePicture?.length);

  const { profilePicture } = req.body;
  if (!profilePicture) return res.status(400).json({ error: 'No image provided' });

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    ).select('-password');

    console.log('✅ Saved! profilePicture length in DB:', user.profilePicture?.length);
    res.json(user);
  } catch(err) {
    console.error('❌ DB Error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;