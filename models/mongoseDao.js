// mongoose 链接
var mongoose = require('mongoose');
mongoose.connect('mongodb://39.106.35.202:27017/zhuanti');
exports.mongoose = mongoose;