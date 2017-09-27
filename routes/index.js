var express = require('express');
var router = express.Router();
var moment = require('moment');
var ArticleDao = require('../models/article');
/* GET home page. */
router.get('/', function(req, res, next) {
  ArticleDao.find({},function (error,doc) {
    for(var i = 0 ; i < doc.length ; i++){
      console.log(moment(doc[i].createTime).format("YYYY-MM-DD"))
        doc[i].createTime = moment(doc[i].createTime).format("MMM Do YY");
    }
    res.render('index', {article:doc});
  });

});

module.exports = router;
