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
        type: DataTypes.STRING, // Ensure a title is always provided
      },
      Description_Offre: {
        type: DataTypes.TEXT,
      },
      Keywords_Offre: {
        type: DataTypes.STRING,
      },
      Status_Offre: {
        type: DataTypes.STRING,
        validate: {
          isIn: [['open', 'closed']],
        },
      },
      ID_Company: {
        type: DataTypes.INTEGER,
        allowNull: false, // Ensure every offer is associated with a company
      },
      // New fields added below
      Durée: {
        type: DataTypes.STRING, // Adjust type if you prefer a specific format
        allowNull: false, // Ensure duration is mandatory
        validate: {
          notEmpty: true,
        },
      },
      Période: {
        type: DataTypes.STRING, // Adjust type if necessary
        allowNull: false, // Ensure period is mandatory
        validate: {
          notEmpty: true,
        },
      },
      Tuteur: {
        type: DataTypes.STRING, // Store the supervisor's name
        allowNull: true, // Supervisor field can be optional
      },
    },
    {
      timestamps: false, // Disable createdAt and updatedAt columns
    }
  );

  Offre.associate = (models) => {
    // Association with the Entreprise table
    Offre.belongsTo(models.Entreprise, {
      foreignKey: 'ID_Company',
      as: 'Company',
    });

    // Association with the OffreFlag table
    Offre.hasMany(models.OffreFlag, {
      foreignKey: 'ID_Offre',
      as: 'Flags',
    });

    // Association with the Candidature table
    Offre.hasMany(models.Candidature, {
      foreignKey: 'ID_Offre',
      as: 'Candidatures',
    });
  };

  return Offre;
};