module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_add_elements', {
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
        price: {
          type: 'NUMERIC',
        },
        rule: {
          type: DataTypes.INTEGER,
        },
        is_activ: {
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