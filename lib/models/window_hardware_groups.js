/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('window_hardware_groups', {
    is_push: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code_sync: {
      type: DataTypes.STRING,
      allowNull: true
    },
    max_width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    min_width: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    max_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    min_height: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    is_default: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    noise_coeff: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heat_coeff: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    producer: {
      type: DataTypes.STRING,
      allowNull: true
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_in_calculation: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_group: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    folder_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_editable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    short_name: {
      type: DataTypes.STRING,
      allowNull: true
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
