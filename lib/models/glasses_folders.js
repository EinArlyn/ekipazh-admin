module.exports = function (sequelize, DataTypes) {
    return sequelize.define('glasses_folders', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        glass_folders_id: {
            type: DataTypes.INTEGER,
        },
        element_id: {
            type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};