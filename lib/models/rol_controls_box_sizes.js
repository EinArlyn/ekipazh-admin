module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_controls_box_sizes', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        rol_control_id: {
          type: DataTypes.INTEGER,
        },
        rol_box_size_id: {
          type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};