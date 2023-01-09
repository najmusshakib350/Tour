const Review=require('./../modles/reviewModel');
//const catchAsync=require('./../utils/catchAsync');
const factory=require('./handlerFactory');
exports.setTourUserIds= (req,res,next) =>{
      //Allow Nested Routes
      if(!req.body.tour) req.body.tour=req.params.tourId;
      if(!req.body.user) req.body.user=req.user.id;
      next();
};
exports.getAllReviews=factory.getAll(Review);
exports.getReview=factory.getOne(Review);
exports.CreatReview=factory.createOne(Review);
exports.updateReview=factory.updateOne(Review);
exports.deleteReview=factory.deleteOne(Review);