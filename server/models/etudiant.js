module.exports = (sequelize, DataTypes) => {
  const Etudiant = sequelize.define('Etudiant', {
    ID_Etudiant: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nom_Etudiant: DataTypes.STRING,
    Prenom_Etudiant: DataTypes.STRING,
    Date_Naissance_Etudiant: {
      type: DataTypes.DATEONLY, // Use DATEONLY to store only the date part (YYYY-MM-DD)
    },
    Email_Etudiant: DataTypes.STRING,
    Tel_Etudiant: DataTypes.STRING,
    CV_Etudiant: DataTypes.STRING,
    Filiere_Etudiant: {
      type: DataTypes.INTEGER, // Make sure this matches the type of 'ID_CDF'
    },
    Statut_Recherche: DataTypes.STRING,
    MotDePasse_Etudiant: DataTypes.STRING,
  }, {
    timestamps: false // Disable createdAt and updatedAt columns
  });

  Etudiant.associate = (models) => {
    Etudiant.belongsTo(models.ChefFiliere, {
      foreignKey: 'Filiere_Etudiant',
      as: 'Filiere',
    });
  };

  return Etudiant;
};
