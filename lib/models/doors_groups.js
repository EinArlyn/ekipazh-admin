/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('doors_groups', {
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
    heat_coeff_value: {
      type: 'NUMERIC',
      allowNull: true
    },
    noise_coeff: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    heat_coeff: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cameras: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rama_sill_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    code_sync_white: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shtulp_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    impost_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    stvorka_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    door_sill_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    rama_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    folder_id: {
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
