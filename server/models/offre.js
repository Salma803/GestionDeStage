module.exports = (sequelize, DataTypes) => {
    const Offre = sequelize.define(
      'Offre',
      {
        ID_Offre: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        Titre_Offre: {
          type: DataTypes.STRING,
        },
        Description_Offre: {
          type: DataTypes.TEXT,
        },
        Status_Offre: {
            type: DataTypes.STRING,
            validate: {
              isIn: [['open', 'closed']],
            },
        Keywords_Offre: {
          type: DataTypes.STRING, // Liste des mots-clés, séparés par des virgules
        },
        ID_Company: {
          type: DataTypes.INTEGER,
        },
      }},
      {
        timestamps: false, // Disable createdAt and updatedAt columns
      }
    );
  
    Offre.associate = (models) => {
      // Association avec la table des entreprises
      Offre.belongsTo(models.Entreprise, {
        foreignKey: 'ID_Company',
        as: 'Company',
      });
  
      // Association avec Offer_Flag
      Offre.hasMany(models.OffreFlag, {
        foreignKey: 'ID_Offre',
        as: 'Flags',
      });
    };
  
    return Offre;
  };
  