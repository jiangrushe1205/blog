var express = require('express');
var router = express.Router();
var ArticleDao = require('../models/article');
/* GET home page. */
router.get('/', function(req, res, next) {
  ArticleDao.find({},function (error,doc) {
    console.log(doc)
    res.render('index', {article:doc});
  });

});

module.exports = router;
