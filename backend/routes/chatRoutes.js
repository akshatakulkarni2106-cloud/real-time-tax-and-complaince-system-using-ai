const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Groq = require('groq-sdk');
const ChatHistory = require('../models/ChatHistory');
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

router.get('/history', auth, async (req, res) => {
  const history = await ChatHistory.findOne({ userId: req.user.id });
  res.json(history ? history.messages : []);
});

router.post('/send', auth, async (req, res) => {
  try {
    const { message } = req.body;
    const user = await User.findById(req.user.id);
    const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const aiResponse = await client.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1000,
      messages: [
        {
          role: 'system',
          content: `You are TaxSaathi, a friendly Tax & Compliance Copilot for Indian micro-businesses.
               User: ${user.name}, Business: ${user.businessType}, Income: ${user.income}, State: ${user.state}.
               Give simple, jargon-free answers about Indian tax laws (GST, ITR, PAN etc). Be encouraging.`
        },
        { role: 'user', content: message }
      ]
    });

    const botReply = aiResponse.choices[0].message.content;

    let history = await ChatHistory.findOne({ userId: req.user.id });
    if (!history) history = new ChatHistory({ userId: req.user.id, messages: [] });
    history.messages.push({ role: 'user', text: message });
    history.messages.push({ role: 'bot', text: botReply });
    history.updatedAt = new Date();
    await history.save();

    res.json({ reply: botReply });
  } catch (err) {
    console.error('CHAT ERROR:', err);
    res.status(500).json({ error: err.message });
  }
});

router.delete('/history', auth, async (req, res) => {
  await ChatHistory.findOneAndDelete({ userId: req.user.id });
  res.json({ success: true });
});

module.exports = router;