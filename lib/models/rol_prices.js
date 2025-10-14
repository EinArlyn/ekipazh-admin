/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rol_prices', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    rol_lamel_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    id_rol_box: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    price: {
      type: 'NUMERIC',
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
