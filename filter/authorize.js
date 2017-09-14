exports.authorize = function(req, res, next) {
    console.log("---------------- >> >> 用户名:" + req.session.user)
    if (req.session.user) {
        res.redirect('/admin/login');
    } else {
        next();
    }
}