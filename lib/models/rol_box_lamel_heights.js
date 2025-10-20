module.exports = function (sequelize, DataTypes) {
  return sequelize.define('rol_box_lamel_heights', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    rol_lamel_id: {
      type: DataTypes.INTEGER,
    },
    id_rol_box: {
      type: DataTypes.INTEGER,
    },
    rol_box_size_id: {
      type: DataTypes.INTEGER,
    },
    height_is_grid: {
      type: 'NUMERIC'
    },
    height_not_grid: {
      type: 'NUMERIC'
    }
  }, {
    timestamps: false
  });
};
