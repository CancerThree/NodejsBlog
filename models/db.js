var Sequelize = require('sequelize');

const sequelize = new Sequelize('share_blog', 'wenjie', 'jj717226', {
    host: '127.0.0.1',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    define: {
        timestamps: false
    }
});

module.exports = sequelize;