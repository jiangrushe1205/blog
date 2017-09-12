var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('login', { title: '登录' });
});

/* GET home page. */
router.post('/post', function(req, res, next) {
    debugger;
    if(!req.body.usename || !req.body.pwd){
        res.send(commonUtils.result(false,"用户名或者密码不正确"));
    }

    if(req.body.usename == '840398688@qq.com' && req.body.pwd == 'qwerty'){
        res.render('index', { title: 'jiangrushe' });
    }
});

module.exports = router;
