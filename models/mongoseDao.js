// mongoose 链接
var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.1.50:27017/zhuanti');
exports.mongoose = mongoose;