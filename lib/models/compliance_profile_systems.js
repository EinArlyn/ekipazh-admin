module.exports = function (sequelize, DataTypes) {
    return sequelize.define('compliance_profile_systems', {
        country_id: {
            type: DataTypes.INTEGER,
        },
        profile_system_id: {
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