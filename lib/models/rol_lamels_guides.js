module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_lamels_guides', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        rol_lamel_id: {
          type: DataTypes.INTEGER,
        },
        rol_guide_id: {
          type: DataTypes.INTEGER,
        },
        max_width: {
          type: DataTypes.INTEGER,
        },
        max_square: {
          type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};