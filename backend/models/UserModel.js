const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true },
  password:       { type: String, required: true },
  businessType:   { type: String, default: '' },
  income:         { type: String, default: '' },
  state:          { type: String, default: '' },
  gstRegistered:  { type: String, default: 'No' },
  apiKey:         { type: String, default: '' },
  profilePicture: { type: String, default: '' },
  checklist:      { type: Map, of: Boolean, default: {} },
  createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);