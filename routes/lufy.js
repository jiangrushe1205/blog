var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/saolei', function (req, res, next) {
    res.render('saolei');
});

router.get('/she', function (req, res, next) {
    res.render('youxi/she');
});


module.exports = router;
