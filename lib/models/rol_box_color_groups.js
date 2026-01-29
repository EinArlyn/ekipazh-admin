module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_box_color_groups', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        id_rol_box_size: {
          type: DataTypes.INTEGER,
        },
        rol_color_id: {
          type: DataTypes.INTEGER,
        },
        rol_color_group_id: {
          type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};