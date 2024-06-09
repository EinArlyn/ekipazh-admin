/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('users_accesses', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    menu_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
