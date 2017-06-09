var Promise = require('bluebird');
var marked = Promise.promisifyAll(require('marked'));
var path = require('path');
var fs = Promise.promisifyAll(require('fs'));
var articleService = require('../services/articleService');

var express = require('express');
var router = express.Router();

function posts2Html(app) {
    app.get('/:article_title', function(req, res, next) {
        var article_title = req.params.article_title;
        console.log(article_title);
        if (typeof(article_title) === 'string') {
            var article = {
                title: article_title,
            };
            articleService.getArticles(article)
                .then(result => {
                    if (result.length != 1) {
                        throw (new Error('not found'));
                    }
                    console.log(__dirname + '/../mdviews' + result[0].file_path);
                    // articleTitle = res[0].title;
                    return fs.readFileAsync(__dirname + '/../mdviews' + result[0].file_path);
                })
                .then(data => {
                    return marked(data.toString());
                })
                .then(content => {
                    res.render('posts', { title: article_title, mdcontent: content });
                })
                .catch(next);
        }
        // fs.readFileAsync(__dirname + '/../mdviews' + path + '/' + fileName + '.md')
        //     .then(data => {
        //         marked(data.toString(), (err, content) => {
        //             if (err) {
        //                 console.log(err);
        //                 next(err);
        //             } else {
        //                 res.render('posts', { title: fileName, mdcontent: content });
        //             }
        //         });
        //     })
        //     .catch(err => {
        //         console.log(err);
        //         next();
        //     });
    });

    app.get("/:article_title/:imagefile", function(req, res, next) {
        var article_title = req.params.article_title;
        var imagefile = req.params.imagefile;
        console.log(imagefile);
        console.log(article_title);
        var article = {
            title: article_title,
        };
        articleService.getArticles(article).then(result => {
            if (result.length === 1) {
                var image = {
                    article_id: result[0].article_id,
                    filename: imagefile,
                }
                return articleService.getImages(image);
            } else {
                throw (new Error('no article'));
            }
        }).then(result => {
            if (result.length === 1) {
                res.sendFile(path.join(__dirname, '/../mdviews', result[0].file_path));
            } else {
                throw (new Error('no image'));
            }
        }).catch(next);
    });
}
exports.posts2Html = posts2Html;