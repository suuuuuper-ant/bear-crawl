const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const env = process.env.NODE_ENV || 'local';
if (!env) {
  console.log(`NODE_ENV is ${env}`);
  console.log('SET NODE_EV!!! development or test or production');
  process.exit(1);
}

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
  res.r = (result) => {
    res.json({
      isSuccess: true,
      status: 200,
      description: '성공',
      message: 'success',
      result,
    });
  };
  next();
});

require('./routes')(app);
require('./ErrorHandler')(app);

const PORT = 3000;

app.listen(PORT, () => {
  console.info(`Listening on Port ${PORT} / at ${env} Env`);
});


module.exports = app;
