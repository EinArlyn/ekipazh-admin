/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rol_guide_prices', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rol_guide_id: {
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
