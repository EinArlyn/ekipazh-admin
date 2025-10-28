module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_guides', {
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
        height: {
          type: DataTypes.INTEGER,
        },
        thickness: {
          type: DataTypes.INTEGER,
        },
        is_activ: {
          type: DataTypes.INTEGER,
        },
        is_grid: {
          type: DataTypes.INTEGER,
        },
        is_color: {
          type: DataTypes.INTEGER,
        },
        description: {
          type: DataTypes.STRING,
        },
        price: {
          type: 'NUMERIC',
        },
        img: {
          type: DataTypes.STRING,
        }
    }, {
        timestamps: false
      }
)};