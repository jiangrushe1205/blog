//公共资源模块
var express      = require('express');
var session      = require('express-session');
var validator    = require('express-validator');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var path         = require('path');
var logger       = require('morgan');
/**
 * 安全验证
 */
var passport      = require('passport');
var passportLocalStrategy = require('passport-local').Strategy;

/**
 * 上传图片
 */
var OSS = require('ali-oss').Wrapper;
var co = require('co');
var fs = require('fs');
var multer = require('multer');

/**
 * formDataj解析
 */
var formidable = require('formidable');


var app = express();

//设置模板
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

/**
 * session 调节
 */
// app.use(express.cookieParser());
// app.use(express.session({
//     secret: 'www.91freefly.com',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: true,
//         maxAge: 60000
//     }
// }))
app.use(passport.initialize())
app.use(passport.session())

/**
 *
 * 阿里云oss
 */
var client = new OSS({
    region: 'oss-cn-qingdao',
    accessKeyId: 'SdIb90jKzhQBpjZR',
    accessKeySecret: 'xQStzsVWO3RwyfO90vKfa0vZ4A73GX'
});

// co(function* () {
//     var result = yield client.listBuckets();
//     console.log(result);
// }).catch(function (err) {
//     console.log(err);
// });


co(function*() {
    client.useBucket('91jyy');      //Your Bucket name
    var result = yield client.list({
        'max-keys': 5
    });
}).catch(function (err) {
    console.log(err);
});

//上传图片
app.post("/upload", function (req, res, next) {
    console.log(req.file);
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        client.put(files.listPic.name, files.listPic.path).then(function (r1) {
            console.log('put success: %j', r1);
            res.send(r1.url);
        }).then(function (r2) {
            console.log('get success: %j', r2);
        }).catch(function (err) {
            console.error('error: %j', err);
        });
    });
})


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

//业务模块
var authorize = require('./filter/authorize');
var index = require('./routes/index');
var users = require('./routes/user');
var adminArticle = require('./routes/admin/article');
var admin = require('./routes/admin/index');
var adminLogin = require('./routes/admin/login');
var article = require('./routes/article');
var lufy = require('./routes/lufy');

//业务访问模块
app.use('/', index);
app.use('/users', users);
app.use('/article', article);
app.use('/admin', admin);
app.use('/admin/login', adminLogin);
app.use('/admin/article', adminArticle);
app.use('/lufy', lufy);

//
// passport.use("local",new passportLocalStrategy(function (username,password,done) {
//     var user = {
//         id: '1',
//         username: '840398688@qq.com',
//         password: 'qwerty'
//     };
//
//     if (username !== user.username) {
//         return done(null, false, { message: 'Incorrect username.' });
//     }
//     if (password !== user.password) {
//         return done(null, false, { message: 'Incorrect password.' });
//     }
//
//     return done(null,user);
// }))
//
// passport.serializeUser(function(user,done){
//     done(null,user);
// })
//
// passport.deserializeUser(function(user,done){
//     done(null,user);
// })
// 404 拦截
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


app.set('port', process.env.PORT || 3001);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
