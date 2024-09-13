const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  userInfo: {
    name: String,
    contact: String,
    email: String,
  },
  services: [
    {
      id: Number,
      name: String,
      price: Number,
    },
  ],
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
  },
  razorpay_signature: {
    type: String,
  },
},{timestamps:true});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
