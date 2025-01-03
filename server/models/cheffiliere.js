module.exports = (sequelize, DataTypes) => {
    const ChefFiliere = sequelize.define('ChefFiliere', {
      ID_CDF: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      Nom_CDF: DataTypes.STRING,
      Prenom_CDF: DataTypes.STRING,
      Email_CDF: DataTypes.STRING,
      Tel_CDF: DataTypes.STRING,
      FiliereAssociee_CDF: DataTypes.STRING,
      MotDePasse_CDF: DataTypes.STRING,
    }, {
      timestamps: false // Disable createdAt and updatedAt columns
    });
  
    ChefFiliere.associate = (models) => {
      ChefFiliere.hasMany(models.Etudiant, {
        foreignKey: 'Filiere_Etudiant', 
        as: 'Etudiants', 
      });
    };
  
    return ChefFiliere;
  };
  