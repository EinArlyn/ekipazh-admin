module.exports = function (sequelize, DataTypes) {
    return sequelize.define('pls_system_grid_links', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        system_id: {
          type: DataTypes.INTEGER,
        },
        grid_id: {
          type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};