//Third party module
const express = require('express');
const tourControler = require('./../controllers/tourcontrol');
const authController=require('./../controllers/authController');
const reviewRouter=require('./reviewRoutes');
// Mounting multiple router
const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(tourControler.aliasTopTours, tourControler.getAllTourse);
router.route('/tour-stats').get(tourControler.getTourStats);
router.route('/monthly-plan/:year').get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),tourControler.getMonthlyPlan);
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourControler.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi
router.route('/distances/:latlng/unit/:unit').get(tourControler.getDistances);


router
  .route('/')
  .get(tourControler.getAllTourse)
  .post(authController.protect,authController.restrictTo('admin','lead-guide'),tourControler.creatTour);


router
  .route('/:id')
  .get(tourControler.getTour)
  .patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourControler.uploadTourImages, tourControler.resizeTourImages, tourControler.updateTour)
  .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourControler.deleteTour);
  //Four better understand nested routes

  //router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'), reviewController.CreatReview);
module.exports = router;