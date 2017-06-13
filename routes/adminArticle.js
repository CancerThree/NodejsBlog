/**
 * @filename:adminArticle.js
 * 
 */
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var express = require('express');
var router = express.Router();
var multer = Promise.promisifyAll(require('multer'));
var articleService = require('../services/articleService');

var storagePath = '';

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var fileType = /\.(\w+)$/.exec(file.originalname)[1];
        var fileName = /(.*)\.(\w+)$/.exec(file.originalname)[1];

        if (fileType === 'md') {
            storagePath = '/' + fileName;
        }
        var path = __dirname + '/../mdviews' + storagePath + '/';
        // var fs = require('fs')
        if (!fs.existsSync(path)) {
            fs.mkdirAsync(path)
                .catch(err => {
                    cb(err);
                });
        }

        cb(null, path);
        // if (storagePath != '') {
        //     storagePath = title + '/';
        // } else {
        //     // .md 文件此时文件已经经过文件名过滤，直接截取其文件名作为存储地址
        //     storagePath = file.originalname.slice(0, file.originalname.length - 3);
        // }
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb) {
        console.log(file);
        if (!/^[^\\/:\*\?"<>\|]+\.(md|jpg|png|gif)$/.test(file.originalname)) {
            cb('type errs', false);
        } else {
            cb(null, true);
        }
    }
}).fields([{ name: 'blogFile', maxCount: 1 }, { name: 'imageFile' }]);

router.get('/', function(req, res, next) {
    articleService.getAllArticlesAndCount()
        .then(results => {
            res.render('adminArticle', { articles: results.rows });
        })
        .catch(next);
});

router.post('/uploadArticle', function(req, res, next) {
    upload(req, res, function(err) {
        if (err) {
            console.log("in error:" + err);
            res.json({ errorInfo: err });
            // next(err);
        } else {
            var title = req.body.title;
            var tags = req.body.tags;
            console.log('in 1111111' + req.file);
            console.log('in upload: ' + title);

            if (title == null || title === '') {
                title = /(.+)\.(\w+)$/.exec(req.files.blogFile[0].filename)[1];
            }

            var article = {
                title: title,
                tags: tags == null ? '' : tags,
                file_path: storagePath + '/' + req.files.blogFile[0].originalname,
            };

            var images = [];
            if (req.files.imageFile != null) {
                for (var i = 0; i < req.files.imageFile.length; i++) {
                    var image = {
                        filename: req.files.imageFile[i].filename,
                        file_path: storagePath + '/' + req.files.imageFile[i].filename,
                    }
                    images.push(image);
                }
            }

            articleService.addArticle(article, images)
                .then((result) => {
                    console.log('upload article and images:');
                    console.log(result);
                    res.json({ errorCode: 0 });
                })
                .catch(err => {
                    console.log(err);
                    res.json({ errorInfo: err });
                });
        }
    });
});

router.post('/deleteArticle', function(req, res, next) {
    var article = {};
    article.article_id = req.body.article_id;
    article.title = req.body.title;
    articleService.deleteArticle(article)
        .then(result => {
            console.log(result);
            res.json({ errorCode: 0 });
        })
        .catch(err => {
            console.log(err);
            res.json({ errorInfo: err });
        });
});

router.get('/addArticle', function(req, res, next) {

});

module.exports = router;