module.exports = function (sequelize, DataTypes) {
    return sequelize.define('pls_template_system_links', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        template_id: {
          type: DataTypes.INTEGER,
        },
        system_id: {
          type: DataTypes.INTEGER,
        }
    }, {
        timestamps: false
      }
)};