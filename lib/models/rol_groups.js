module.exports = function (sequelize, DataTypes) {
    return sequelize.define('rol_groups', {
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
        is_activ: {
          type: DataTypes.INTEGER,
        },
        position: {
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