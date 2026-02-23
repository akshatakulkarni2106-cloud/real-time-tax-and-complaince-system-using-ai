require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/chat',      require('./routes/chatRoutes'));
app.use('/api/checklist', require('./routes/checklistRoutes'));
app.use('/api/profile',   require('./routes/profileRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log('✅ Server running on port 5000'));
  })
  .catch(err => console.error('❌ MongoDB Error:', err));