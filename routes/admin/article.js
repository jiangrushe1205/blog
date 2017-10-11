var express = require('express');
var ArticleDao = require('../../models/article');
var CategoryDAO = require('../../models/category');
var router = express.Router();

/**
 * 爬虫
 * @type {request}
 */
var request = require('request');
var cheerio = require('cheerio');

/**
 * 创建文章
 */
router.get('/create', function (req, res, next) {

    CategoryDAO.find({}, function (error, doc) {
        res.render('admin/createArticle', {"categoryList": doc});
    })

});

/**
 * 保存文章
 */
router.post("/save", function (req, res, next) {

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
        content: req.body.content,
        listPic: req.body.listPic,
        summary:req.body.summary
    };
    ArticleDao.save(article, function (err) {
        if (err) {
            var json = {error: ermsg.join("\n")};
            res.render('admin/create', json);
        } else {
            CategoryDAO.findOne({categoryName:req.body.category},function (error,doc) {
                if(doc){
                    var count = doc.count?parseInt(doc.count):0;
                    CategoryDAO.update({"categoryName":req.body.category},{ "count": count + 1 },function(error,doc){
                        console.log("-------------------------" + doc);
                    })
                }else{
                    console.log("-------------------------失败");
                }

            })
            res.redirect('/admin/article/success');
        }
    })

})

/**
 * 文章成功页面
 */
router.get('/success', function (req, res, next) {
    res.render('admin/createSuccess', {errorMsg: ""});
});


/* GET home page. */
router.get('/reptile', function (req, res, next) {

    request('http://www.qq.com/', function(error, response, body) {
        if (!error && response.statusCode == 200) {
            $ = cheerio.load(body);
            console.log($("#newsInfoQuanguo").html());
        }
    })


});

/**
 * 添加分类
 */
router.get('/category', function (req, res, next) {
    res.render('admin/addCategory', {errorMsg: ""});
});

/**
 * 添加分类
 */
router.post('/add/category', function (req, res, next) {
    req.assert('categoryName', "分类不能为空").notEmpty();
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
    var category = {
        categoryName: req.body.categoryName,
        count:0
    };


    CategoryDAO.save(category, function (err) {
        if (err) {
            var json = {error: ermsg.join("\n")};
            res.render('admin/category', json);
        } else {
            res.redirect('/admin/article/success');
        }
    })
});


module.exports = router;
