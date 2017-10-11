var express = require('express');
var router = express.Router();
var moment = require('moment');
var ArticleDao = require('../models/article');
var CategoryDao = require('../models/category');
var co = require('co');
/* GET home page. */
router.get('/detail', function(req, res, next) {

    var aritcleDetail = function(){
        return new Promise(function(resolve,reject){
            ArticleDao.find({"_id":req.query.id},function (error,doc) {
                if(error) reject(error);
                doc[0].createTimeString = moment(doc[0].createTime).format("YYYY-MM-DD");
                resolve(doc)
            });
        })
    }

    var categoryList = function(){
        return new Promise(function(resolve,reject){
            CategoryDao.find({}, function (error, doc) {
                if (error) reject(error);
                resolve(doc)
            })
        })
    }

    co(function* (){
        var f1 = yield aritcleDetail();
        var f2 = yield categoryList();
        res.render('aritcleDetail', {"article":f1,"categoryList":f2});
    })


});

router.get('/category/:category', function(req, res, next) {

    var aritcleDetail = function(){
        return new Promise(function(resolve,reject){
            ArticleDao.find({"category":req.params.category},function (error,doc) {
                if(error) reject(error);
                for (var i = 0; i < doc.length; i++) {
                    doc[0].createTimeString = moment(doc[0].createTime).format("YYYY-MM-DD");
                }
                resolve(doc)
            });
        })
    }

    var categoryList = function(){
        return new Promise(function(resolve,reject){
            CategoryDao.find({}, function (error, doc) {
                if (error) reject(error);
                resolve(doc)
            })
        })
    }

    co(function* (){
        var f1 = yield aritcleDetail();
        var f2 = yield categoryList();
        res.render('articleCategoryList',{"article":f1,"categoryList":f2});
    })


});

module.exports = router;
