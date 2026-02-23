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

module.exports = router;