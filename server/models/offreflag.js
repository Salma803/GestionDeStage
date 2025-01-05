module.exports = (sequelize, DataTypes) => {
    const OffreFlag = sequelize.define('OffreFlag', {
      ID_Flag: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ID_CDF: DataTypes.STRING,
      ID_Offre: DataTypes.INTEGER,
      Status_Flag: {
        type: DataTypes.STRING,
      },
      Comments: DataTypes.TEXT,
    }, {
      timestamps: false,
    });
  
    OffreFlag.associate = (models) => {
      OffreFlag.belongsTo(models.ChefFiliere, {
        foreignKey: 'ID_CDF',
        as: 'ChefFiliere',
      });
      OffreFlag.belongsTo(models.Offre, {
        foreignKey: 'ID_Offre',
        as: 'Offre',
      });
    };
  
    return OffreFlag;
  };
  