module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_box_sizes', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        id_rol_box: {
          type: DataTypes.INTEGER,
        },
        height: {
          type: DataTypes.INTEGER,
        },
        width: {
          type: DataTypes.INTEGER,
        },
        box_price: {
          type: DataTypes.INTEGER,
        },
    }, {
        timestamps: false
      }
)};