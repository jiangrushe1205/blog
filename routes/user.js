// /* GET users listing. */
// exports.list = function(req, res){
//   res.send('respond with a resource');
// };
var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var router = express.Router();

/* GET home page. */
router.get('/user', function(req, res, next) {
  // res.render('user', { title: 'jiangrushe' });

  request("https://m.toutiao.com/?W2atIF=1",function(error,response,body){
      if(!error && response.statusCode == 200){
          $ = cheerio.load(body);
          console.log($(".list_content").find(".has_action").length);
          res.json({
              cat:$(".list_content").find(".has_action").length
          })
      }
  });

});

module.exports = router;
