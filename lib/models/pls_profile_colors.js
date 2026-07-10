module.exports = function (sequelize, DataTypes) {
    return sequelize.define('pls_profile_colors', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        group_id: {
          type: DataTypes.INTEGER,
        },
        is_active: {
          type: DataTypes.INTEGER,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        sku: {
          type: DataTypes.STRING,
          allowNull: false
        },
        position: {
          type: DataTypes.INTEGER,
        },
        img: {
          type: DataTypes.STRING,
        },
    }, {
        timestamps: false
      }
)};