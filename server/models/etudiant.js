module.exports = (sequelize, DataTypes) => {
  const Etudiant = sequelize.define('Etudiant', {
    ID_Etudiant: {
      type: DataTypes.STRING, // Change type to STRING for manual assignment
      primaryKey: true, // Keep it as the primary key
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
      type: DataTypes.STRING, // Change to match the type of 'ID_CDF' in ChefFiliere
    },
    Statut_Recherche: {
      type: DataTypes.STRING,
      defaultValue: 'false',  // Default value as a string 'false'
    },    
    MotDePasse_Etudiant: DataTypes.STRING,
  }, {
    timestamps: false, // Disable createdAt and updatedAt columns
  });

  Etudiant.associate = (models) => {
    Etudiant.belongsTo(models.ChefFiliere, {
      foreignKey: 'Filiere_Etudiant',
      as: 'Filiere',
    });
  };

  return Etudiant;
};
