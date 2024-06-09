/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('lists', {
    glass_color: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_push: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    glass_image: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    glass_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    doorstep_type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    in_door: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    beed_lamination_id: {
      type: DataTypes.INTEGER,
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
    cameras: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    waste: {
      type: 'NUMERIC',
      allowNull: true
    },
    amendment_pruning: {
      type: 'NUMERIC',
      allowNull: true
    },
    addition_folder_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    add_color_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '1'
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: '10000'
    },
    parent_element_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    d: {
      type: 'NUMERIC',
      allowNull: true
    },
    c: {
      type: 'NUMERIC',
      allowNull: true
    },
    b: {
      type: 'NUMERIC',
      allowNull: true
    },
    a: {
      type: 'NUMERIC',
      allowNull: true
    },
    list_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    list_group_id: {
      type: DataTypes.INTEGER,
      allowNull: false
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
