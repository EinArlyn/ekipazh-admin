/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'muntins_profile_links',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      muntins_id: {
        type: DataTypes.INTEGER,
      },
      profile_id: {
        type: DataTypes.INTEGER,
      }
    },
    {
      timestamps: false,
    }
  );
};
