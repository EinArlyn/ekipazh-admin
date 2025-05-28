/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_margins', {
    margin_add_elem: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    margin_construct: {
      type: 'NUMERIC',
      allowNull: true,
      defaultValue: '0.0'
    },
    user_id: {
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