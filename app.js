//公共资源模块
var express = require('express');
var session = require('express-session');
var validator = require('express-validator');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var OSS = require('ali-oss').Wrapper;
var co = require('co');
var fs = require('fs');

var app = express();
//session拦截器
app.use(cookieParser());
app.use(validator());
app.use(session({
    secret: '1234567890',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true ,
        maxAge: 60000
    }
}))

var client = new OSS({
    accessKeyId: 'SdIb90jKzhQBpjZR',
    accessKeySecret: 'xQStzsVWO3RwyfO90vKfa0vZ4A73GX',
    region: '91jyy.oss-cn-qingdao'
});

// // 上传一个文件，成功后下载这个文件
// client.put('object', '/tmp/file').then(function (val) {
//     console.log(val.res);
//     return client.get('object');
// }).then(function (val) {
//     console.log(val.res);
//     console.log(val.content.toString());
// });


//设置模板
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

//业务模块
var index = require('./routes/index');
var users = require('./routes/user');
var adminArticle = require('./routes/admin/article');
var admin = require('./routes/admin/index');
var adminLogin = require('./routes/admin/login');

var authorize = require('./filter/authorize');

app.all('/admin/*',authorize.authorize, function(req, res, next){
    next()
});



//业务访问模块
app.use('/', index);
app.use('/users', users);

app.use('/admin', admin);
app.use('/admin/login', adminLogin);
app.use('/admin/article', adminArticle);
// //登录拦截器


// 404 拦截
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
   console.log('Express server listening on port ' + server.address().port);
});
