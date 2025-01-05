module.exports = (sequelize, DataTypes) => {
    const Gestionnaire = sequelize.define('Gestionnaire', {
      ID_Gestionnaire: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Nom_Gestionnaire: DataTypes.STRING,
      Prenom_Gestionnaire: DataTypes.STRING,
      Email_Gestionnaire: DataTypes.STRING,
      Tel_Gestionnaire: DataTypes.STRING,
      MotDePasse_Gestionnaire: DataTypes.STRING,
    }, {
      timestamps: false // Disable createdAt and updatedAt columns
    });
  
    return Gestionnaire;
  };
  