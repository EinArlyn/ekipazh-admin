module.exports = function (sequelize, DataTypes) {
    return sequelize.define('compliance_lamination_colors', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        lamination_factory_colors_id: {
            type: DataTypes.INTEGER,
        },
        country_id: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};