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

var user = {
    user_id: 1,
};

exports.deleteUserAndArticles(user).then(res => {
    console.log(res);
}).catch(err => {
    console.log(err);
})