const mongoose = require('mongoose');


const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits'], 
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['office', 'staff'],  
    required: true
  }
}, {
  timestamps: true  
});


const Admin = mongoose.model('Admin',adminSchema);

module.exports = Admin;
