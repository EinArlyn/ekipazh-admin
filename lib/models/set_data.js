module.exports = function (sequelize, DataTypes) {
    return sequelize.define('set_data', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        sets_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        profile_systems_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        window_hardware_groups_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        list_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
};