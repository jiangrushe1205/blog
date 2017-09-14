var express = require('express');
var router = express.Router();
var AccountDAO = require("../../models/Account");

router.get('/', function (req, res, next) {
    res.render('admin/login', {errorMsg: ""});
});

router.post('/post', function (req, res, next) {

    try {
        if (req.body.username && req.body.pwd) {
            AccountDAO.find(req.body.username, req.body.pwd, function (error, Account) {
                if (error) {
                    console.log(error);
                    return handleError(error);
                }
                if (Account != null && Account != '') {
                    req.session.user = req.body.username;
                    res.redirect("/admin/index");
                } else {
                    res.render("login", {"errorMsg": "用户名或者密码错误"});
                }

                // else{
                //     AccountDAO.save(req.body.username,req.body.pwd,function (error) {
                //         console.log(error+"**************");
                //     })
                // }


            });
        } else {
            res.send("用户名或者密码不正确");
        }
    } catch (e) {
        console.log(e);
    }
});

router.get('/register', function (req, res, next) {
    res.render('register',{errorMsg:""});
});

router.post('/add', function (req, res, next) {
    try {
        console.log("**************");
        if( req.body.onePwd != req.body.twoPwd){
            res.render('register',{errorMsg:"两次密码不一致"});
        }

        AccountDAO.save(req.body.username, req.body.onePwd, function (error) {
            req.session.user = req.body.username;
            res.redirect("/admin/index");
        })

    } catch (e) {
        console.log(e);
    }
});


router.get('/logout', function (req, res, next) {
    delete req.session.user;
    res.redirect('/admin/login');
});


module.exports = router;
