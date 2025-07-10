/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('profile_systems', {
    is_sliding: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    impost_in_stvorka_list_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    is_push: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    code_sync_white: {
      type: DataTypes.STRING,
      allowNull: true
    },
    code_sync: {
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
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    is_default: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    is_editable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '1'
    },
    shtulp_list_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    impost_list_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    stvorka_list_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    rama_still_list_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    rama_list_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: '0'
    },
    folder_id: {
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
      autoIncrement: true,
      primaryKey: true
    }
  }, {
    timestamps: false
  });
};
