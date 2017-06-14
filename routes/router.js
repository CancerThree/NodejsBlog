function sendMdFile(fileName) {

}

module.exports = function(app) {
    app.use('/', require('./index'));
    app.use('/users', require('./users'));
    app.use('/adminArticle', require('./adminArticle'));
    app.use('/adminUser', require('./adminUser'));
    app.use('/login', require('./login'));

    //app.use('/*', require('./posts2Html'));
    require('./posts2Html').posts2Html(app);
    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
}