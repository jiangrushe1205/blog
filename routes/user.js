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

  request("http://www.qq.com/",function(error,response,body){
      if(!error && response.statusCode == 200){
          $ = cheerio.load(body);
    
          var content = $("#newsContent01 ul").text();
          // for(var i = 0; i<content.length; i++){
          //
          // }

          res.json({"content":content})
      }
  });

});

module.exports = router;
