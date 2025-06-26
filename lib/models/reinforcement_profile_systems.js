/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('reinforcement_profile_systems', {
    range: {
      type: 'NUMERIC',
      allowNull: true
    },
    reinforcement_type_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    rules_reinforcement_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    profile_systems_id: {
      type: DataTypes.INTEGER,
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
