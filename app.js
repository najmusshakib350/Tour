const path = require('path');


const express = require('express');
const morgan = require('morgan');
const rateLimit= require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const bodyParser=require('body-parser');

const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter=require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
//Stripe webhook
const bookingController=require('./controllers/bookingController');
const viewRouter=require('./routes/viewRoutes');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
//Serving Static files ...start
//app.use(express.static(`${__dirname}/public`));
//Serving Static files ...end

//Security Middleware start
app.use(helmet());

//For mapbox end code
app.use(
  helmet.contentSecurityPolicy({
  directives: {
  defaultSrc: ["'self'", 'https:', 'http:','data:', 'ws:'],
  baseUri: ["'self'"],
  fontSrc: ["'self'", 'https:','http:', 'data:'],
  scriptSrc: [
  "'self'",
  'https:',
  'http:',
  'blob:'],
  styleSrc: ["'self'", 'https:', 'http:','unsafe-inline']
  }
  })
 );
//For mapbox end code


if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
const limiter=rateLimit({
  max:200,
  windowMs:60*60*1000,
  message:'Too many requests from this Ip, Please try again in an hour!'
});

app.use('/',limiter);

//Security Middleware end


//Stripe webhook url
// app.post('/webhook-checkout', app.use(express.raw()),bookingController.webhookCheckout);
app.post('/webhook-checkout',bodyParser.raw({ type: 'application/json' }),bookingController.webhookCheckout);

//Reading data from body into req.body    ...start
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
//Reading data from body into req.body    ...end
//Data sanitization against NOSQL query injection  ...start
app.use(mongoSanitize());
//Data sanitization against NOSQL query injection  ...end
//Data sanitization against xss   ..start
app.use(xss());
//Data sanitization against xss   ..end

//Prevent parameter pollution

app.use(hpp({
  whitelist:[
    'duration',
    'ratingsQuantity',
    'ratingsAverage',
    'maxGroupSize',
    'difficulty',
    'price'
  ]
}));

app.use(compression());










// Add headers
app.use(function (req, res, next) {
  //please follow this part better understanding for this part 
  //https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
  //https://stackoverflow.com/questions/18310394/no-access-control-allow-origin-node-apache-port-issue
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});










//Test middleware ..start
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});
//Test middleware ..start

//Router Mount

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);
//Handling Unhandled Routes
app.all('*',(req,res,next)=>{
    next(new AppError(`Can not find ${req.originalUrl} on this server`,404));
});
//Second step we will implement global error handling middleware

app.use(globalErrorHandler);

module.exports = app;