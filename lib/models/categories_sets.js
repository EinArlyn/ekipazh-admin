module.exports = function (sequelize, DataTypes) {
    return sequelize.define('categories_sets', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: '0'
        },
    }, {
        timestamps: false
    });
};