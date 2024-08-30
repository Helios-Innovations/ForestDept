const crypto = require('crypto');
const Order = require('../models/userModel'); 
const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_APT_SECRET,
});

exports.checkout = async (req, res) => {
  try {
    const { userInfo, services } = req.body;

    // Calculate the total amount by summing up the price of all services
    const totalAmount = services.reduce((acc, service) => acc + service.price, 0);
    console.log(totalAmount);

    // Convert the total amount to paise (multiply by 100)
    const options = {
      amount: Number(totalAmount * 100),
      currency: "INR",
    };

    // Create a new order in Razorpay
    console.log("Razorpay Options:", options);
    const order = await instance.orders.create(options);

    // Store order details in the database
    const newOrder = await Order.create({
      amount: totalAmount, // Store the amount in rupees in the database
      userInfo,
      services,
      razorpay_order_id: order.id,
      razorpay_payment_id: "",
      razorpay_signature: "",
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
exports.paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Fetch the order from the database
  const order = await Order.findOne({ razorpay_order_id });
  if (!order) {
    return res.status(400).json({
      success: false,
      message: "Order not found",
    });
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_APT_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Update the order with payment details
    order.razorpay_payment_id = razorpay_payment_id;
    order.razorpay_signature = razorpay_signature;
    await order.save();

    res.redirect(
      `http://localhost:3000/paymentsuccess?reference=${razorpay_payment_id}`
    );
  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

exports.getBookingDetails=async(req,res)=>{

  try {
    const { reference } = req.params;
    console.log(reference)
    const order = await Order.findOne({ razorpay_payment_id: reference });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }
    
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
}
