module.exports = function (sequelize, DataTypes) {
    return sequelize.define('compliance_rol_groups', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        rol_group_id: {
            type: DataTypes.INTEGER,
        },
        country_id: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};