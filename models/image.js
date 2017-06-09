var Sequelize = require('sequelize');
var sequelize = require('./db');
var article = require('./article');

const image = sequelize.define('image', {
    image_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    filename: {
        type: Sequelize.STRING(128),
        allowNull: false,
    },
    article_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    file_path: {
        type: Sequelize.STRING(128),
        allowNull: false,
    }
}, {
    freezeTableName: true,
});
image.belongsTo(article, { as: 'article', foreignKey: 'article_id', targetKey: 'article_id' });
article.hasMany(image, { as: 'image', foreignKey: 'article_id', sourceKey: 'article_id' });
module.exports = image;