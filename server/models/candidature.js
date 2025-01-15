module.exports = (sequelize, DataTypes) => {
    const Candidature = sequelize.define(
      'Candidature',
      {
        ID_Candidature: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ID_Etudiant: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        ID_Offre: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        ID_CDF: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        Réponse_Entreprise: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        Réponse_CDF: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        timestamps: false,
      }
    );
  
    Candidature.associate = (models) => {
      Candidature.belongsTo(models.Etudiant, {
        foreignKey: 'ID_Etudiant',
        as: 'Etudiant',
      });
  
      Candidature.belongsTo(models.Offre, {
        foreignKey: 'ID_Offre',
        as: 'Offre',
      });
  
      Candidature.belongsTo(models.ChefFiliere, {
        foreignKey: 'ID_CDF',
        as: 'ChefDeFiliere',
      });

      Candidature.hasMany(models.Entretien, {
        foreignKey: 'ID_Candidature',
        as: 'Entretiens',
      });
      
    };
  
    return Candidature;
  };
  