//Third party module
const express = require('express');
const userControler = require('./../controllers/usercontroler');
const authController=require('./../controllers/authController');


// Mounting multiple router
const router = express.Router();

//Route delear for user
router.get('/me', authController.protect,userControler.getMe,userControler.getuser);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

//Protect All routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword',authController.updatePassword);
router.patch('/updateMe',userControler.uploadUserPhoto,userControler.resizeUserPhoto, userControler.updateMe);
router.delete('/deleteMe',userControler.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/')
.get(userControler.getAllUsers)
.post(userControler.createUsers);
router.route('/:id')
.get(userControler.getuser)
.patch(userControler.updateUser)
.delete(userControler.deleteUser);

module.exports = router;