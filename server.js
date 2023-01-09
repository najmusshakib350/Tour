const mongoose = require('mongoose');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  process.exit('1');
});
dotenv.config({
  path: './config.env',
});

const app = require('./app');

//Database Connection Code Start
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    //mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connection Succesfull!!!!');
  });
//Database Connection Code is end

//console.log(process.env);

//Start server
const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`This port number is ${port}`);
});

process.on('unhandledRejection', (err) => {
  server.close(() => {
    process.exit(1);
  });
});
