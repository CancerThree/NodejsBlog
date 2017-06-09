var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
// var fs = require('fs');
var articleService = require('../services/articleService');
var fs = Promise.promisifyAll(require('fs'));

/* GET home page. */
router.get('/', function(req, res, next) {
    articleService.getAllArticlesAndCount()
        .then(results => {
            res.render('index', { title: '分享Blog', fileList: results.rows });
        })
        .catch(next);
    // fs.readdirAsync(__dirname + '/../mdviews')
    //     .then(files => {
    //         return new Promise((resolve, reject) => {
    //             var fileList = [];
    //             console.log(files);
    //             for (var i = 0; i < files.length; i++) {
    //                 console.log(__dirname + '/../mdviews/' + files[i]);
    //                 if (fs.statSync(__dirname + '/../mdviews/' + files[i]).isDirectory() ||
    //                     !/\.md$/.test(files[i])) {
    //                     console.log('true');
    //                     continue;
    //                     // files.splice(i, 1);
    //                 }
    //                 fileList.push(files[i].split('.')[0]);
    //                 // fs.statAsync(__dirname + '/../mdviews/' + files[i])
    //                 //     .then(stats => {
    //                 //         if (stats.isDirectory()) {
    //                 //             // var a = [];
    //                 //             console.log('asas' + files[i]);
    //                 //             files.splice(i, 1);
    //                 //         }
    //                 //     })
    //                 //     .then(() => {
    //                 //         resolve(files);
    //                 //     })
    //                 //     .catch(err => {
    //                 //         reject(err);
    //                 //     });
    //             }
    //             resolve(fileList);
    //         });
    //     })
    //     .then(fileList => {
    //         console.log(fileList);
    //         res.render('index', { title: 'Nodejs介绍', fileList: fileList });
    //     })
    //     .catch(err => {
    //         next(err);
    //     });

});

module.exports = router;