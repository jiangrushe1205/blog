var express = require('express');
var router = express.Router();
var moment = require('moment');
var ArticleDao = require('../models/article');
/* GET home page. */
router.get('/detail', function(req, res, next) {
    ArticleDao.find({"_id":req.query.id},function (error,doc) {
        doc[0].createTimeString = moment(doc[0].createTime).format("YYYY-MM-DD");
        res.render('aritcleDetail', {article:doc});
    });

});

module.exports = router;
