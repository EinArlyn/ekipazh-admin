/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('profile_laminations', {
    // impost_in_stvorka_list_id: {
    //   type: DataTypes.INTEGER,
    //   allowNull: true,
    //   defaultValue: '0'
    // },
    color_sync: {
      type: DataTypes.STRING,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: false
    },
    code_sync: {
      type: DataTypes.STRING,
      allowNull: true
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
    lamination_out_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    lamination_in_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    profile_id: {
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
