var express = require('express');
var router = express.Router();
var userService = require('../services/userService');

router.get('/', function(req, res, next) {
    res.sendFile((require('path').join(__dirname, '../views', 'login.html')));
});

router.post('/signin', function(request, response, next) {
    var user = request.body;
    userService.userSignin(user)
        .then(res => {
            request.session.user = res;
            response.json({ errorCode: 0 });
        })
        .catch(err => {
            response.json({ errorInfo: err });
        });
});

router.post('/signup', function(request, response, next) {
    var user = request.body;
    userService.userSignup(user)
        .then(result => {
            request.session.user = result;
            response.json({ errorCode: 0 });
        })
        .catch(err => {
            console.log(err);
            response.json({ errorInfo: err });
        });
});

module.exports = router;