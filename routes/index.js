var express = require('express');
var router = express.Router();
var moment = require('moment');
var ArticleDao = require('../models/article');
var CategoryDao = require('../models/category');
var co = require('co');
/* GET home page. */
router.get('/', function (req, res, next) {

    var article = function(){
        return new Promise(function(resolve,reject){
            ArticleDao.find({}, function (error, doc) {
                if (error) reject(error);
                for (var i = 0; i < doc.length; i++) {
                    doc[i].createTimeString = moment(doc[i].createTime).format("YYYY-MM-DD");
                }
                resolve(doc);
            })
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
        var f1 = yield article();
        var f2 = yield categoryList();
        res.render('index', {"article":f1,"categoryList":f2});
    })


});

module.exports = router;
