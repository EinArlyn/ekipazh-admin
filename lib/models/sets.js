module.exports = function (sequelize, DataTypes) {
    return sequelize.define('sets', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        categories_sets_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        is_visible: {
            type: DataTypes.INTEGER,
            default: 1
        },
	img: {
	    type: DataTypes.STRING,
	    allowNull: true
	},
	description: {
	    type: DataTypes.STRING,
	    allowNull: false
	},
    }, {
        timestamps: false
    });
};