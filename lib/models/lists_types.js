/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('lists_types', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    image_add_param: {
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
