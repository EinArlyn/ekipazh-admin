/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('price_koefficients', {
    value: {
      type: 'NUMERIC',
      allowNull: true
    },
    koef_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    element_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
