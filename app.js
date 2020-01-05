var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const osis = require('./osis/osis_connection.js')

//авторизация
//const passport = require('passport')
//const session = require('session')
//const RedisSttore = require('connection-redis')(session)
///////

var app = express();

///
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'
                       /*, {
    dotfiles: 'ignore',
    etag: false,
    extension: ['htm, html, css,'],
    index: false,
    maxAge: '1d',
    redirect: false,
    setHeaders: function(res, path, stat){
        res.set('x-timestamp', date.now())
        res.set('Content-type', 'text/html; charset=windows-1251')
    }
}*/))

app.use('/', indexRouter);
app.use('/users', usersRouter);


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
