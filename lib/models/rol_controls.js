module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_controls', {
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
        is_activ: {
          type: DataTypes.INTEGER,
        },
        is_standart: {
          type: DataTypes.INTEGER,
        },
        price: {
          type: 'NUMERIC',
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