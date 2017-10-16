var express = require('express');
var ArticleDao = require('../../models/article');
var CategoryDao = require('../../models/category');
var moment = require('moment');
var co = require('co');
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
    var categoryList = function () {
        return new Promise(function (resolve, reject) {
            CategoryDao.find({}, function (error, doc) {
                if (error) reject(error);
                resolve(doc)
            })
        })
    }


    co(function*() {
        var f2 = yield categoryList();
        res.render('admin/createArticle', {"categoryList": f2});
    })

});

/**
 * 创建文章
 */
router.get('/update/:id', function (req, res, next) {
    var categoryList = function () {
        return new Promise(function (resolve, reject) {
            CategoryDao.find({}, function (error, doc) {
                if (error) reject(error);
                resolve(doc)
            })
        })
    }

    var aritcleDetail = function () {
        return new Promise(function (resolve, reject) {
            ArticleDao.find({"_id": req.params.id}, function (error, doc) {
                if (error) reject(error);
                doc[0].createTimeString = moment(doc[0].createTime).format("YYYY-MM-DD");
                resolve(doc)
            });
        })
    }

    co(function*() {
        var f1 = yield aritcleDetail();
        var f2 = yield categoryList();
        res.render('admin/updateArticle', {"article": f1, "categoryList": f2});
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
        summary: req.body.summary
    };

    if (!req.body._id) {
        ArticleDao.save(article, function (err) {
            if (err) {
                var json = {error: ermsg.join("\n")};
                res.render('admin/create', json);
            } else {
                CategoryDao.findOne({categoryName: req.body.category}, function (error, doc) {
                    if (doc) {
                        var count = doc.count ? parseInt(doc.count) : 0;
                        CategoryDao.update({"categoryName": req.body.category}, {"count": count + 1}, function (error, doc) {
                            console.log("-------------------------" + doc);
                        })
                    } else {
                        console.log("-------------------------失败");
                    }

                })
                res.redirect('/admin/article/success');
            }
        })
    } else {
        ArticleDao.update({"_id": req.body._id}, article, function (err) {
            if (err) {
                var json = {error: ermsg.join("\n")};
                res.render('admin/update', json);
            } else {
                res.redirect('/admin/article/list');
            }
        })
    }
})


/**
 * 创建文章
 */
router.get('/delete/:id', function (req, res, next) {
    var udpateArticle = function(){
        return new Promise(function(accpect,reject){
            ArticleDao.find({"_id": req.params.id}, function (error, doc) {
                if (error) console.log(error);
                console.log("******************" + doc[0].category );
                CategoryDao.findOne({categoryName: doc[0].category}, function (error, doc) {
                    if (doc) {
                        console.log("******************" + doc.categoryName );
                        var count = doc.count ? parseInt(doc.count) - 1 : 0;
                        console.log("******************" + count);
                        CategoryDao.update({"categoryName": doc.categoryName}, {"count": count}, function (error, doc) {
                            console.log("-------------------------" + doc);
                            accpect(doc);
                        })
                    } else {
                        console.log("-------------------------失败");
                    }
                })
            })
        })
    }

    var deleteArticle = function(){
        return new Promise(function(accept,reject){
            ArticleDao.delete({"_id": req.params.id}, function (error, doc) {
                if (error) console.log(error);
                console.log(doc)
                accept(doc);
            });
        })
    }

    co(function*(){
        yield udpateArticle();
        yield deleteArticle();
        res.redirect('/admin/article/list');
    })

});


/**
 * 文章成功页面
 */
router.get('/success', function (req, res, next) {
    res.render('admin/createSuccess', {errorMsg: ""});
});


/* GET home page. */
router.get('/reptile', function (req, res, next) {

    request('http://www.qq.com/', function (error, response, body) {
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
        count: 0
    };


    CategoryDao.save(category, function (err) {
        if (err) {
            var json = {error: ermsg.join("\n")};
            res.render('admin/category', json);
        } else {
            res.redirect('/admin/article/success');
        }
    })
});


router.get('/list', function (req, res, next) {

    ArticleDao.find({}, function (error, doc) {
        if (error) reject(error);
        for (var i = 0; i < doc.length; i++) {
            doc[i].createTimeString = moment(doc[i].createTime).format("YYYY-MM-DD");
        }
        res.render('admin/articleList', {"articles": doc});
    })


});

module.exports = router;
