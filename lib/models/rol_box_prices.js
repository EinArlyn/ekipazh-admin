/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rol_box_prices', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    id_rol_box: {
      type: DataTypes.INTEGER,
    },
    split_price: {
      type: 'NUMERIC'
    }
  }, {
    timestamps: false
  });
};
