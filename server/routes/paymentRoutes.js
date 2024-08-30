const express=require('express');
const {
  checkout,
  paymentVerification,
  getBookingDetails,
} =require('../controllers/paymentController');


const router = express.Router();


router.post("/checkout",checkout)
router.post("/paymentverification",paymentVerification);
router.get("/:reference",getBookingDetails)
module.exports= router;
