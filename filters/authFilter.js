module.exports = function(app) {
    app.get('/adminUser*', function(req, res, next) {
        session = req.session;

        if (session.user != null || req.url == '/login') {
            next();
        } else {
            res.redirect('/login');
        }
    });
}