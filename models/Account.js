var mongodb = require('../models/mongoseDao');

var Schema = mongodb.mongoose.Schema;
var accountSchema = new Schema({
    userName:  String,
    password: String,
    createTime: { type: Date, default: Date.now }
});

var Account = mongodb.mongoose.model('account', accountSchema);

// accountSchema.methods.loginCheck('Account', function(err, account) {
//     console.log(animals);
// });
var AccountDAO = function(){};

AccountDAO.prototype.find = function(name,password, callback) {
    console.log({"userName":name,"password":password});
    Account.findOne({"userName":name,"password":password}, function(err, obj){
        callback(err, obj);
    });
};

AccountDAO.prototype.save = function(name,password, callback) {
    var account = new Account({"userName":name,"password":password});
    account.save({"userName":name,"password":password}, function(err){
        callback(err);
    });
};


module.exports = new AccountDAO();