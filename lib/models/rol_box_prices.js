/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rol_box_prices', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_rol_box_size: {
      type: DataTypes.INTEGER,
    },
    rol_color_group_id: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: 'NUMERIC'
    }
  }, {
    timestamps: false
  });
};
