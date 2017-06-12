var Sequelize = require('sequelize');
var sequelize = require('./db');
var article = require('./article');

const user = sequelize.define('user', {
    user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_name: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true,

    },
    email: {
        type: Sequelize.STRING(128),
        allowNull: true,
        unique: true,
        isEmail: true,
    },
    password: {
        type: Sequelize.STRING(128),
        allowNull: false,
        validate: {
            len: {
                args: [6, 128],
                msg: '密码长度应在6~128之间'
            }
        }
    },
}, {
    freezeTableName: true,
});

article.belongsTo(user, { as: 'article', foreignKey: 'author_id', targetKey: 'user_id' });
user.hasMany(article, { as: 'article', foreignKey: 'author_id', sourceKey: 'user_id' });
module.exports = user;