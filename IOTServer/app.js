var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
//var logger = require('morgan');
const logger = require('./config/winston')  //LDH 

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var lidarRouter  =require('./routes/lidar');
var cctvRouter   =require('./routes/cctv');

var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

//ejs 엔진을 실행하기 위한 코드
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');


app.get('/data0', function(req, res){
  var context = [
      { 'a' : 'Hello', 'b' : 'World' },
      { 'a' : 'javacript', 'b' : 'is ...'},
      { 'a' : 'web', 'b' : 'is ...'}
  ]
  // data라는 이름으로 전달
  // ejs 파일에서는 data[1].a 와 같은 형식으로 사용
  
  //logger.debug("message ..........:" + req.body);
  
  res.render('data0.ejs', {'data' : context}, function(err ,html){
      if (err){
    	  logger.debug(err)
      }
      res.end(html) // 응답 종료
  })
  
});

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/lidar', lidarRouter);
app.use('/cctv', cctvRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
