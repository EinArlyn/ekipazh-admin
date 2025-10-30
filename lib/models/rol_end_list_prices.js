/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rol_end_list_prices', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rol_end_list_id: {
      type: DataTypes.INTEGER,
    },
    rol_color_group_id: {
      type: DataTypes.INTEGER,
    },
    price: {
      type: 'NUMERIC'
    },
    rol_price_rules_id: {
      type: DataTypes.INTEGER,
    }
  }, {
    timestamps: false
  });
};
