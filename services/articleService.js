var articleModel = require('../models/article');
var imageModel = require('../models/image');
var Promise = require('bluebird');
var sequelize = require('../models/db');

/**
 * @name addArticle
 * @param{object} article:要插入的article
 * @param{array} images:article中包含的image数组
 * @description 插入article以及其相关的image数组，分别插入article以及image表,
 *              article类必须包含title、author_id，file_path为空可能导致无法找到文章路径     
 */
exports.addArticle = function(article, images) {
    //TODO: delete author_id
    article.author_id = 112;

    return sequelize.transaction(function(t) {
        return articleModel.create(article, { transaction: t })
            .then(res => {
                var promises = [];
                for (var i = 0; i < images.length; i++) {
                    images[i].article_id = res.article_id;
                    var newPromise = imageModel.create(images[i], { transaction: t });
                    promises.push(newPromise);
                }
                return Promise.all(promises);
            });
    });
}

/**
 * @name updateArticle
 * @param{object} article
 * @description 根据article.article_id修改article对应记录
 */
exports.updateArticle = function(article) {
    if (article.article_id == null) {
        throw (new Error('article_id cannot be null'));
    }
    return articleModel.update(article, {
        where: {
            article_id: article.article_id,
        }
    });
}

/**
 * @name getArticles
 * @param{object} article
 * @description 从article中的值查询所有符合条件的数据，类中各值在查询时的逻辑是AND查询
 */
exports.getArticles = function(article) {
    return articleModel.findAll({
        where: article
    });
}

/**
 * @param getImages
 * @param{object} image
 * @description 从image中的值查询所有符合条件的数据，类中各值在查询时的逻辑是AND查询
 */
exports.getImages = function(image) {
    return imageModel.findAll({
        where: image,
    });
}

/**
 * @name getArticleAndImages
 * @param{object} article
 * @description 从article中查找所有符合article参数条件的数据，并从中取出各个article关联的image数据
 * @return{array} 包含所有符合条件的article数据数组
 * @example:
 * ```
 * 获取article属性：
 * res[0].article_id;
 * 获取image属性：
 * res[0].image[0].article_id;
 * ```
 */
exports.getAricleAndImages = function(article) {
    return articleModel.findAll({
        include: [{ model: imageModel, as: 'image' }],
        where: article
    });
}

/**
 * @name updateArticleAndImage
 * @param{object} article
 * @param{array} images
 * @description 根据article.article_id修改一个article数据,根据images[i].images_id修改一个image数据.
 *              注意：不保证article与image的数据必须是关联的，article_id、images_id必须存在
 */
exports.updateArticleAndImage = function(article, images) {
    if (article.article_id == null) {
        throw (new Error('article_id is null'));
    }
    return sequelize.transaction(function(t) {
        return articleModel.update(article, {
                where: {
                    author_id: article.author_id,
                }
            }, { transaction: t })
            .then(res => {
                var promises = [];
                for (var i = 0; i < images.length; i++) {
                    if (images[i].image_id == null) {
                        throw (new Error('image_id is null'));
                    }
                    var newPromise = imageModel.update(images[i], {
                        image_id: images[i].image_id,
                    }, { transaction: t });
                    promises.push(newPromise);
                }
                return Promise.all(promises);
            })
    });
}

exports.deleteArticleWithTransaction = function(article, t) {
    return articleModel.destroy({
            where: {
                article_id: article.article_id,
            },
            transaction: t,
        }, { transaction: t })
        .then(res => {
            if (res === 0) {
                throw Error('no article deleted');
            }
            return imageModel.destroy({
                where: {
                    article_id: article.article_id,
                },
                transaction: t,
            }, { transaction: t });
        });
}

/**
 * @name deleteArticle
 * @param{object} article
 * @description 根据article内参数删除数据，article_id必须，同时删除相关联的image数据
 */
exports.deleteArticle = function(article) {
    if (article.article_id == null) {
        throw (new Error('need article_id'));
    }
    return sequelize.transaction(function(t) {
        return articleModel.destroy({
                where: {
                    article_id: article.article_id,
                }
            }, { transaction: t })
            .then(res => {
                if (res === 0) {
                    throw Error('no article deleted');
                }
                return imageModel.destroy({
                    where: {
                        article_id: article.article_id,
                    }
                }, { transaction: t });
            });
    });
}

/**
 * @name getAllArticlesAndCount
 * @param{void} void
 * @description 返回所有article数据，并以last_modify_time降序排序
 */
exports.getAllArticlesAndCount = function() {
    return articleModel.findAndCountAll({
        order: [
            ['last_modify_time', 'DESC']
        ],
    });
}

/**
 * @name updateImage
 * @param{array} images
 * @description 根据image_id更新image数据,image_id必须
 */
exports.updateImage = function(images) {
    var promises = [];
    for (var i = 0; i < images.length; i++) {
        if (images[i].image_id == null) {
            throw (new Error('no article_id'));
        }
        promises.push(imageModel.update(images[i], {
            where: {
                image_id: images[i].image_id,
            }
        }, {
            transaction: t
        }));
    }
    return Promise.all(promises);
}

/**
 * @name deleteImage
 * @param{array} images
 * @description 根据image_id删除image数据
 */
exports.deleteImage = function(images) {
    var promises = [];
    for (var i = 0; i < images.length; i++) {
        if (images[i].image_id == null) {
            throw (new Error('no article_id'));
        }
        promises.push(imageModel.destroy({
            where: {
                image_id: images[i].image_id,
            }
        }, {
            transaction: t
        }));
    }
    return Promise.all(promises);
}

/**
 * @name addImage
 * @param{array} images
 * @description 插入image数据，article_id必须
 */
exports.addImage = function(images) {
    var promises = [];
    for (var i = 0; i < images.length; i++) {
        if (images[i].article_id == null) {
            throw (new Error('no article_id'));
        }
        promises.push(imageModel.create(images[i], { transaction: t }));
    }
    return Promise.all(promises);
}

// var ar = {
//     // tags: "tes",
//     // author_id: 112,
//     // title: "test",
//     article_id: 4,
// };

// exports.getArticles(ar)
//     .then(res => {
//         console.log(res);
//         console.log(res.length);
//         // console.log(res[0].image.length);
//         // console.log(res[0].article_id);
//     })
//     .catch(err => {
//         console.log(err);
//     })

// var im = [{ filename: 'ss' }, { filename: 'ss1' }, { filename: 'ss2' }];
// exports.deleteArticle(ar)
//     .then(res => {
//         console.log('ressss:');
//         console.log(res);
//     }).catch(err => {
//         console.log(err);
//     });
// exports.updateArticle(ar)
//     .then(res => {
//         console.log(res);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// exports.getAllArticles()
//     .then(res => {
//         console.log(res.count);
//         for (var i = 0; i < res.rows.length; i++) {
//             console.log(res.rows[i].title);
//         }
//     })
//     .catch(err => {
//         console.log(err);
//     })

// exports.deleteArticle({
//     article_id: 11,
// }).then(res => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// });