/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('glass_similarities', {
    element_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profile_system_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    similarity_id: {
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
