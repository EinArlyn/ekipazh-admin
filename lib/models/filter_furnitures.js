/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('filter_furnitures', {
    factory_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    modified: {
      type: DataTypes.DATE,
      allowNull: true
    },
    functions: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true
    },
    manufacturer: {
      type: DataTypes.ARRAY(DataTypes.STRING),
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
