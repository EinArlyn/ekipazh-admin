/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('list_contents_colors', {
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    lamination_color_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    list_content_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  });
};
