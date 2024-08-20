module.exports = function (sequelize, DataTypes) {
    return sequelize.define('compliance_addition_folders', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        addition_folders_id: {
            type: DataTypes.INTEGER,
        },
        country_id: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};