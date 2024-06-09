/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('window_hardware_type_ranges', {
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    min_height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    min_width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    max_width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    factory_id: {
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
