var Sequelize = require('sequelize');
var sequelize = require('./db');

const article = sequelize.define('article', {
    article_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: Sequelize.STRING(128),
        unique: true,
        allowNull: false,
        validate: {
            len: {
                args: [1, 128],
                msg: '标题过长，长度在128以下',
            }
        }
    },
    author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    tags: {
        type: Sequelize.STRING(128),
        allowNull: true,
    },
    create_time: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
    last_modify_time: {
        type: 'TIMESTAMP',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
    },
    upload_time: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW,
    },
    file_path: {
        type: Sequelize.STRING(128),
        allowNull: false,
        defaultValue: '/',
    },

}, {
    freezeTableName: true,
});

module.exports = article;