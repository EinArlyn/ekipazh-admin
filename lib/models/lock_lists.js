/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('lock_lists', {
    modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    list_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    timestamps: false
  });
};
