var mongodb = require('../models/mongoseDao');

var Schema = mongodb.mongoose.Schema;
var categorySchema = new Schema({
    categoryName:  String,
    count:String
});

var Category = mongodb.mongoose.model('category', categorySchema);


var CategoryDAO = function(){};

CategoryDAO.prototype.save = function(json, callback) {
    var category = new Category(json);
    category.save(function(err){
        callback(err);
    });
};

CategoryDAO.prototype.find = function(json, callback) {
    Category.find(json,callback);
};

CategoryDAO.prototype.findOne = function(json, callback) {
    Category.findOne(json,callback);
};

CategoryDAO.prototype.update = function(conditions,update,callback){
    Category.update(conditions,update,callback);
}

module.exports = new CategoryDAO();