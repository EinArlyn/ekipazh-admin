/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('lamination_factory_colors', {
    lamination_folders_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lamination_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
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
