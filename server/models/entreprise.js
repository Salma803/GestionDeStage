module.exports = (sequelize, DataTypes) => {
  const Entreprise = sequelize.define('Entreprise', {
    ID_Entreprise: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Nom_Entreprise: DataTypes.STRING,
    Adresse_Entreprise: DataTypes.STRING,
    Tel_Entreprise: DataTypes.STRING,
    Email_Entreprise: DataTypes.STRING,
    MotDePasse_Entreprise: DataTypes.STRING,
  }, {
    timestamps: false, // Disable createdAt and updatedAt columns
  });

  Entreprise.associate = (models) => {
    // Association with the Offre table
    Entreprise.hasMany(models.Offre, {
      foreignKey: 'ID_Company',
      as: 'Offres',
    });
  };

  return Entreprise;
};
