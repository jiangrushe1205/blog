// /* GET users listing. */
// exports.list = function(req, res){
//   res.send('respond with a resource');
// };
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/create', function(req, res, next) {
    res.render('admin/createArticle', {errorMsg: ""});
});

module.exports = router;
