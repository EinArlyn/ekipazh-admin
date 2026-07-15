/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('pls_system_colors_prices', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    color_group_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    system_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    value: {
      type: 'NUMERIC'
    }
  }, {
    timestamps: false
  });
};
