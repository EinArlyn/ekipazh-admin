module.exports = function (sequelize, DataTypes) {
    return sequelize.define('pls_system_groups', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        factory_id: {
          type: DataTypes.INTEGER,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        position: {
          type: DataTypes.INTEGER,
        },
        is_active: {
          type: DataTypes.INTEGER,
        },
        description: {
          type: DataTypes.STRING,
        }
    }, {
        timestamps: false
      }
)};