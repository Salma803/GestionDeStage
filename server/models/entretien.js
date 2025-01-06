module.exports = (sequelize, DataTypes) => {
    const Entretien = sequelize.define(
      'Entretien',
      {
        ID_Entretien: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        ID_Candidature: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        Réponse_Entreprise: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        Réponse_Etudiant: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        timestamps: false,
      }
    );
  
    Entretien.associate = (models) => {
      Entretien.belongsTo(models.Candidature, {
        foreignKey: 'ID_Candidature',
        as: 'Candidature',
      });
    };
  
    return Entretien;
  };
  