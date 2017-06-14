var Promise = require('bluebird');
var express = require('express');
var router = express.Router();
var userService = require('../services/userService');
var articleService = require('../services/articleService');

router.get('/', function(req, res, next) {
    res.render('adminUser');
});

router.get('/my-settings', function(req, res, next) {
    var user = req.session.user;
    res.render('page-views/my-settings', { user: user });
})

router.get('/my-blogs', function(req, res, next) {
    var user = {
        author_id: 112 //req.session.user.user_id,
    }
    articleService.getArticles(user).then(blogs => {
        res.render('page-views/my-blogs', { articles: blogs });
    }).catch(err => {
        console.log(err);
        next(err);
    });
})

module.exports = router;