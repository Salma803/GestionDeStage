module.exports = (sequelize, DataTypes) => {
    const Stage = sequelize.define('Stage', {
        // Primary Key for Stage
        ID_Stage: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Auto-incrementing primary key
        },

        // Foreign Key to Entretien
        ID_Entretien: {
            type: DataTypes.INTEGER,
            allowNull: false, // Ensure the foreign key is required
        },

        // Student-related fields
        ID_Etudiant: {
            type: DataTypes.STRING, // Assuming student ID is manually assigned
            allowNull: false, // Ensures every stage record is linked to a student
        },
        Nom_Etudiant: DataTypes.STRING,
        Prenom_Etudiant: DataTypes.STRING,
        Date_Naissance_Etudiant: {
            type: DataTypes.DATEONLY, // Date of birth (YYYY-MM-DD)
        },
        Email_Etudiant: DataTypes.STRING,
        Tel_Etudiant: DataTypes.STRING,
        Filiere_Etudiant: DataTypes.STRING,
        Annee_Etudiant: DataTypes.STRING,

        // CDF-related fields
        Nom_CDF: DataTypes.STRING,
        Prenom_CDF: DataTypes.STRING,
        Email_CDF: DataTypes.STRING,
        Tel_CDF: DataTypes.STRING,

        // Company-related fields
        Nom_Entreprise: DataTypes.STRING,
        Adresse_Entreprise: DataTypes.STRING,
        Tel_Entreprise: DataTypes.STRING,
        Email_Entreprise: DataTypes.STRING,

        // Offer-related fields
        Titre_Offre: DataTypes.STRING,
        Description_Offre: DataTypes.TEXT,
        Durée: DataTypes.STRING, // Duration of the stage
        Période: DataTypes.STRING, // Period of the stage
        Tuteur: DataTypes.STRING, // Supervisor of the stage

    }, {
        timestamps: false, // Disable createdAt and updatedAt columns
    });

    // Associations
    Stage.associate = (models) => {
        // Association with Entretien (foreign key ID_Entretien)
        Stage.belongsTo(models.Entretien, {
            foreignKey: 'ID_Entretien',
            as: 'Entretien',
        });
    };

    return Stage;
};
