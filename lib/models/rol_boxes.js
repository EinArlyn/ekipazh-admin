module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_boxes', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true
        },
        rol_group_id: {
          type: DataTypes.INTEGER,
        },
        is_activ: {
          type: DataTypes.INTEGER,
        },
        position: {
          type: DataTypes.INTEGER,
        },
        is_split: {
          type: DataTypes.INTEGER,
        },
        is_grid: {
          type: DataTypes.INTEGER,
        },
        is_security: {
          type: DataTypes.INTEGER,
        },
        is_revision: {
          type: DataTypes.INTEGER,
        },
        is_engine: {
          type: DataTypes.INTEGER,
        },
        description: {
          type: DataTypes.STRING,
        },
        img: {
          type: DataTypes.STRING,
        }
    }, {
        timestamps: false
      }
)};