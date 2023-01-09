const express=require('express');
const viewController=require('./../controllers/viewController');
const authController=require('./../controllers/authController');
const bookingController = require('../controllers/bookingController');

const router=express.Router();


router.get('/',authController.isLogedIn,viewController.getOverview);
router.get('/tour/:slug',authController.isLogedIn,viewController.getTour);
router.get('/login',authController.isLogedIn,viewController.getLoginForm);
router.get('/signup', authController.isLogedIn,viewController.getSignUp);
router.get('/me', authController.protect, viewController.getAccount);

router.get(
    '/my-tours',
    // bookingController.createBookingCheckout,
    authController.protect,
    viewController.getMyTours
);
  
router.post('/submit-user-data',authController.protect,viewController.updateUserData);
module.exports=router;