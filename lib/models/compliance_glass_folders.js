module.exports = function (sequelize, DataTypes) {
    return sequelize.define('compliance_glass_folders', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        glass_folders_id: {
            type: DataTypes.INTEGER,
        },
        country_id: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};