var articleModel = require('../models/article');
var userModel = require('../models/user');
var Promise = require('bluebird');
var sequelize = require('../models/db');
var articleService = require('./articleService');

exports.addUser = function(user) {
    return userModel.create(user);
}

exports.deleteUser = function(user) {
    if (user.user_id == null) {
        throw (new Error('no user_id'));
    }

    return userModel.destroy({
        where: {
            user_id: user.user_id,
        }
    });
}

exports.deleteUserAndArticles = function(user) {
    if (user.user_id == null) {
        throw (new Error('no user_id'));
    }

    return sequelize.transaction(function(t) {
        return articleModel.findAll({
            where: {
                author_id: user.user_id,
            },
            transaction: t,
        }).then(res => {
            var promises = [];
            for (var i = 0; i < res.length; i++) {
                var article = {
                    article_id: res[i].article_id,
                };
                // if (i == 1) {
                //     throw (new Error('test Error'));
                // }
                promises.push(articleService.deleteArticleWithTransaction(article, t));
            }

            return Promise.all(promises);
        });
    });
}

exports.getUser = function(user) {
    return userModel.findAll({
        where: user,
    });
}

exports.userSignin = function(user) {
    var userCopy = {
        email: user.email,
    };
    return new Promise(function(resolve, reject) {
        exports.getUser(userCopy).then(res => {
            if (res.length === 0) {
                throw (new Error('no such user'));
            }
            if (res[0].password !== user.password) {
                console.log(user.password + " " + res[0].password);
                throw (new Error('wrong password'));
            }
            resolve(res[0]);
        }).catch(err => {
            reject(err);
        });
    });
}

exports.userSignup = function(user) {
    return exports.addUser(user)
}

exports.userSignup = function(user) {
    return sequelize.transaction(function(t) {
        return userModel.findAll({
            where: {
                email: user.email,
            },
            transaction: t,
        }).then(res => {
            if (res.length !== 0) {
                console.log(res);
                throw (new Error('the email exists'));
            }
            return userModel.findAll({
                where: {
                    user_name: user.user_name,
                },
                transaction: t,
            });
        }).then(res => {
            if (res.length !== 0) {
                console.log(res);
                throw (new Error('the user name exists'));
            }
            return userModel.create(user, { transaction: t });
        })
    });
}

// var user = {
//     user_id: 1,
// };

// exports.deleteUserAndArticles(user).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// })