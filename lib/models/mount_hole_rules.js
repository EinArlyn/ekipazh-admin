/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('mount_hole_rules', {
    rule_value: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rule_name: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
