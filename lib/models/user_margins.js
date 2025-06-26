/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_margins', {
    margin_add_elem: {
      type: 'NUMERIC',
      allowNull: false,
      defaultValue: '0.0'
    },
    margin_construct: {
      type: 'NUMERIC',
      allowNull: false,
      defaultValue: '0.0'
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};