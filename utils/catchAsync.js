//const AppError = require('./appError');
module.exports = fn => {
    return (req,res,next) => {
      fn(req,res,next).catch(next)//here next means next(err,req,res,next) and this next function will go into app.js .....app.use(globalErrorHandler);
    };
  };

