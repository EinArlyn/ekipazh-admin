module.exports = function (sequelize, DataTypes) {
    return sequelize.define('compliance_window_hardware_groups', {
        country_id: {
            type: DataTypes.INTEGER,
        },
        window_hardware_group_id: {
            type: DataTypes.INTEGER,
        },
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        }
    }, {
        timestamps: false
      }
)};