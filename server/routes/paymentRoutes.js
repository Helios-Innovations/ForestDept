const express=require('express');
const {
  checkout,
  paymentVerification,
  getBookingDetails,
  getAllTransactions,
} =require('../controllers/paymentController');
const { signup, login } = require('../controllers/authControllers');


const router = express.Router();

router.get('/allTransaction',getAllTransactions)
router.post("/checkout",checkout)
router.post("/paymentverification",paymentVerification);
router.get("/:reference",getBookingDetails)
router.post('/singup',signup)
router.post('/login',login)

module.exports= router;
