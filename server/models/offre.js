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
        type: DataTypes.JSON, // Store keywords as JSON
        
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
  };

  return Offre;
};
