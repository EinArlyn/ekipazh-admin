/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('mosquitos', {
    group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    cloth_waste: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cloth_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    right_waste: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    right_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    top_waste: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    top_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    left_waste: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    left_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bottom_waste: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bottom_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_id: {
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
