/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('doors_laminations_dependencies', {
    impost_in_stvorka_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    rama_sill_list_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
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
    lamination_out: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    lamination_in: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '0'
    },
    group_id: {
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
