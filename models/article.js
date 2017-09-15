var mongodb = require('../models/mongoseDao');

var Schema = mongodb.mongoose.Schema;
var articleSchema = new Schema({
    title:  String,
    tag:    String,
    author:  String,
    category:  String,
    content: String,
    createTime: { type: Date, default: Date.now },
    updateTime: { type: Date, default: Date.now }
});

var Article = mongodb.mongoose.model('article', articleSchema);


var ArticleDAO = function(){};

ArticleDAO.prototype.save = function(json, callback) {
    var article = new Article(json);
    article.save(function(err){
        callback(err);
    });
};
module.exports = new ArticleDAO();