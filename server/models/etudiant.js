module.exports = (sequelize, DataTypes) => {
  const Etudiant = sequelize.define('Etudiant', {
    ID_Etudiant: {
      type: DataTypes.STRING, 
      primaryKey: true,
    },
    Nom_Etudiant: DataTypes.STRING,
    Prenom_Etudiant: DataTypes.STRING,
    Date_Naissance_Etudiant: {
      type: DataTypes.DATEONLY, 
    },
    Email_Etudiant: DataTypes.STRING,
    Tel_Etudiant: DataTypes.STRING,
    CV_Etudiant: DataTypes.STRING,
    Filiere_Etudiant: {
      type: DataTypes.STRING, 
    },
    Annee_Etudiant: DataTypes.STRING, // 1A, 2A, 3A
    Statut_Etudiant: DataTypes.STRING, // en cours, doplomé, abandonné
    Statut_Recherche: {
      type: DataTypes.STRING,
      defaultValue: 'false', 
    },    
    MotDePasse_Etudiant: DataTypes.STRING,
    Supprimé_Etudiant: {
      type: DataTypes.STRING,
      defaultValue: 'false',
    }    
  }, {
    timestamps: false, // Disable createdAt and updatedAt columns
  });

  Etudiant.associate = (models) => {
    // Association with ChefFiliere (Filiere_Etudiant points to ID_CDF)
    Etudiant.belongsTo(models.ChefFiliere, {
      foreignKey: 'Filiere_Etudiant',
      as: 'Filiere',
    });

    // Association with Candidature table (to link student applications)
    Etudiant.hasMany(models.Candidature, {
      foreignKey: 'ID_Etudiant',
      as: 'Candidatures',
    });
  };

  return Etudiant;
};