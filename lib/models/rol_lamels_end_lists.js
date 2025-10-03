module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_lamels_end_lists', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        rol_lamel_id: {
          type: DataTypes.INTEGER,
        },
        rol_end_list_id: {
          type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};