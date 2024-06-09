/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('mounting', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    currency_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price: {
      type: 'NUMERIC',
      allowNull: true
    },
    mounting_rule_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
