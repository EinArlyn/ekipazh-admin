module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_guide_color_groups', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        rol_guide_id: {
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