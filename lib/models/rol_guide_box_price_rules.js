/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rol_guide_box_price_rules', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rol_guide_id: {
      type: DataTypes.INTEGER,
    },
    rol_groups_id: {
      type: DataTypes.INTEGER,
    },
    rol_price_rules_id: {
      type: DataTypes.INTEGER,
    }
  }, {
    timestamps: false
  });
};
