/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rol_price_rules', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false
  });
};
