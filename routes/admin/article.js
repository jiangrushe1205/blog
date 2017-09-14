var express = require('express');
var ArticleDao = require('../../models/article');

var router = express.Router();

/* GET home page. */
router.get('/create', function (req, res, next) {
    res.render('admin/createArticle', {errorMsg: ""});
});

router.post("/save", function (req, res, next) {

    console.log(req.session.user)
    req.assert('title', "标题不能为空").notEmpty();
    req.assert('author', "作者不能为空").notEmpty();
    req.assert('tag', "标签不能为空").notEmpty();
    req.assert('category', "分类不能为空").notEmpty();
    req.assert('content', "内容不能为空").notEmpty();
        var errors = req.validationErrors();
    if (errors && errors.length > 0) {
        var ermsg = [];
        for (var i = 0; i < errors.length; i++) {
            ermsg.push(errors[i].msg);
        }
        var json = {title: '管理后台-- 请先登录', error: ermsg.join("\n")};
        res.render('admin/login', json);
        return;
    }
    var article = {
        title: req.body.title,
        author: req.body.author,
        tag: req.body.tag,
        category: req.body.category,
        content: req.body.content
    };
    ArticleDao.save(article, function (err) {
        if (err) {
            var json = {error: ermsg.join("\n")};
            res.render('admin/create', json);
        } else {
            res.render('admin/article/success');
        }
    })

})

/* GET home page. */
router.get('/create/success', function (req, res, next) {
    res.render('admin/createSuccess', {errorMsg: ""});
});
module.exports = router;
