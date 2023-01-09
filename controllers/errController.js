const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  //const value=err.keyValue.name.match(/(["'])(\\?.)*?\1/)[0];
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value} Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  //const errors={...err.errors.ratingsAverage};
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalied input data. ${errors.join('. ')}`;

  return new AppError(message, 400);
};
const handleJWTError = (err) =>
  new AppError('Invalid token. Please log in again', 401);
const handleJWTExpiredError = (err) =>
  new AppError('Your token has expired! please log in again!', 401);
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    //1)log err
    console.error('ERROR', err);
    return res.status(err.statusCode).render('error', {
      title: 'Something Went Wrong!',
      msg: err.message,
    });
  }
};
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('./api')) {
    //Operational,Trusted: send to message client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //Programming or other unknown err don't leak error details
    else {
      //1)log err
      console.error('ERROR', err);
      //2) send generic message
      return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong!',
      });
    }
  } else {
    //Operational,Trusted: send to message client
    if (err.isOperational) {
      return res.status(err.statusCode).render('error', {
        title: 'Something Went Wrong!',
        msg: err.message,
      });
    }
    //Programming or other unknown err don't leak error details
    else {
      //1)log err
      console.error('ERROR', err);
      //2) send generic message
      return res.status(err.statusCode).render('error', {
        title: 'Something Went Wrong!',
        msg: 'Please try again later',
      });
    }
  }
};
module.exports = (err, req, res, next) => {
  //console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    //or My own code start
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
      sendErrorProd(error, req, res);
    }
    if (error.code === 11000) {
      error = handleDuplicateFieldsDB(error);
      sendErrorProd(error, req, res);
    }
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
      sendErrorProd(error, req, res);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError(error);
      sendErrorProd(error, req, res);
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError(error);
      sendErrorProd(error, req, res);
    }
    sendErrorProd(error, req, res);
    //or My own code end
  }
};
