var express = require('express');
var router = express.Router();
var moment = require('moment');
var ArticleDao = require('../models/article');
/* GET home page. */
router.get('/', function(req, res, next) {
  ArticleDao.find({},function (error,doc) {
    for(var i = 0 ; i < doc.length ; i++){
      doc[i].createTimeString = moment(doc[i].createTime).format("YYYY-MM-DD");
    }
    res.render('index', {article:doc});
  });

});

module.exports = router;
