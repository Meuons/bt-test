var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var parser = require('bleadvertise');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
const {createBluetooth} = require('node-ble')
const {bluetooth, destroy} = createBluetooth()

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
const runBT = async () => {
  const adapter = await bluetooth.defaultAdapter()
  const device = await adapter.waitDevice('D2:21:57:02:2E:2B')
  await device.connect()
  const gattServer = await device.gatt()
  const service1 = await gattServer.getPrimaryService('0x1800')
  const characteristic1 = await service1.getCharacteristic('0x2A00')
  await characteristic1.writeValue(Buffer.from("Hello world"))
  const buffer = await characteristic1.readValue()
  console.log(buffer)

    }

runBT()
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
