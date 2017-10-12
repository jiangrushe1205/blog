var mongodb = require('../models/mongoseDao');

var Schema = mongodb.mongoose.Schema;
var articleSchema = new Schema({
    title:  String,
    tag:    String,
    author:  String,
    summary: String,
    category:  String,
    content: String,
    listPic:String,
    readCount:String,
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

ArticleDAO.prototype.find = function(json, callback) {
    Article.find(json).sort({'createTime':'desc'}).exec(callback);
};

ArticleDAO.prototype.update = function(conditions,update,callback){
    Article.update(conditions,update,callback);
}


module.exports = new ArticleDAO();