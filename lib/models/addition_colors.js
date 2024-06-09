/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('addition_colors', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lists_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
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
