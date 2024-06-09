/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('order_elements', {
    size: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.000'
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    element_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    order_id: {
      type: 'NUMERIC',
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    }
  }, {
    timestamps: false
  });
};
