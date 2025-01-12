const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { OffreFlag, Offre, ChefFiliere, Entreprise, Etudiant, Candidature, ChefDeFiliere, Entretien } = require('../models');

const { validateToken } = require('../middlewares/AuthMiddleware');

//Route pour Trouver l'id du cdf a partie du token
router.get('/me', validateToken, (req, res) => {
  // req.user contains decoded token information
  const ID_CDF = req.user.ID_CDF;
  const Email_CDF = req.user.Email_CDF;
  res.json({ ID_CDF, Email_CDF });
});

//Route to find the cdf information by ID
router.get('/find/:cdfId', async (req, res) => {
  const { cdfId } = req.params; // Correctly extract cdfId (case-sensitive)
  try {
    // Ensure ID_CDF is compared properly
    const cdf = await ChefFiliere.findOne({
      where: { ID_CDF: cdfId },
    });

    if (!cdf) {
      return res.status(404).json({ error: 'Chef Filière not found' });
    }

    res.json(cdf);
  } catch (error) {
    console.error('Error fetching Chef Filière:', error);
    res.status(500).json({ error: 'Failed to fetch Chef Filière' });
  }
});

router.get('/etudiants/:cdfId', async (req, res) => {
  const { cdfId } = req.params; // Correctly extract cdfId
  try {
    // Find all students with the given ID_CDF
    const etudiants = await Etudiant.findAll({
      where: { Filiere_Etudiant: cdfId },
    });

    if (etudiants.length === 0) {
      return res.status(404).json({ error: 'No students found for the given Chef Filière ID.' });
    }

    // Respond with the list of students
    res.json(etudiants);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Failed to fetch students. Please try again later.' });
  }
});

// Route for Chef Filière login
router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    // Find Admin by email
    const user = await ChefFiliere.findOne({ where: { Email_CDF: email } });

    // Check if Admin exists
    if (!user) {
      return res.status(404).json({ error: "Account doesn't exist" });
    }
    //comparer les mot de passe hashé
    if (mot_de_passe != user.MotDePasse_CDF) {
      return res.status(401).json({ error: "Wrong username and password combination" });
    }
    // Successful login
    const accessToken = jwt.sign({ Email_CDF: user.Email_CDF, ID_CDF: user.ID_CDF }, "secret", { expiresIn: '5h' });
    res.json({
      accessToken,
      email: user.Email_CDF,
    });

  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({ error: 'Unexpected error during login' });
  }
});

//Route to flag an offer
router.post('/flaggerOffre/:id_offre/:id_cdf', async (req, res) => {
  const { id_offre: ID_Offre, id_cdf: ID_CDF } = req.params; // Extract parameters
  const { status_flag: Status_Flag, comments: Comments } = req.body; // Extract from body

  try {
    // Validate input
    if (!ID_Offre || !ID_CDF || !Status_Flag) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate Status_Flag value
    if (!['approved', 'rejected'].includes(Status_Flag)) {
      return res.status(400).json({ error: 'Invalid Status_Flag value' });
    }

    // Check if the offer exists
    const offre = await Offre.findByPk(ID_Offre);
    if (!offre) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Check if the (ID_Offre, ID_CDF) combination already exists
    const existingFlag = await OffreFlag.findOne({
      where: { ID_Offre, ID_CDF },
    });

    if (existingFlag) {
      // Update the existing entry
      existingFlag.Status_Flag = Status_Flag;
      existingFlag.Comments = Comments;
      await existingFlag.save();

      return res.status(200).json({
        message: 'Offer flag updated successfully',
        flag: existingFlag,
      });
    }

    // Create a new entry if it doesn't exist
    const newFlag = await OffreFlag.create({
      ID_CDF,
      ID_Offre,
      Status_Flag,
      Comments,
    });

    return res.status(201).json({
      message: 'Offer flagged successfully',
      flag: newFlag,
    });
  } catch (error) {
    console.error('Error flagging offer:', error);
    return res.status(500).json({ error: 'Failed to flag offer' });
  }
});


//Route to get the flag of an offer 
router.get('/flag/:id_offre/:id_cdf', async (req, res) => {
  const { id_offre, id_cdf } = req.params; // Extract offer ID and CDF ID from params

  try {
    // Find the flag for the given offer ID and CDF ID
    const flag = await OffreFlag.findOne({
      where: { ID_Offre: id_offre, ID_CDF: id_cdf },
    });

    if (!flag) {
      return res.status(404).json({ error: 'Flag not found for the given offer ID and CDF ID' });
    }

    res.status(200).json(flag);
  } catch (error) {
    console.error('Error fetching flag:', error);
    res.status(500).json({ error: 'Failed to fetch flag' });
  }
});

// Get all approved offers for a specific ChefFiliere
router.get('/approvedOffers/:id_cdf', async (req, res) => {
  const { id_cdf } = req.params; // ChefFiliere ID (ID_CDF)

  try {
    // Find all approved flags for the specified ChefFiliere
    const approvedOffers = await OffreFlag.findAll({
      where: {
        ID_CDF: id_cdf,
        Status_Flag: 'approved', // Filter by approved status
      },
      include: [
        {
          model: Offre,
          as: 'Offre',
          // Specify attributes to return
          include: [
            {
              model: Entreprise, // Include the company information
              as: 'Company',
              attributes: ['ID_Entreprise', 'Nom_Entreprise', 'Adresse_Entreprise', 'Tel_Entreprise', 'Email_Entreprise'], // Specify company attributes to return
            },
          ],
        },
      ],
    });

    if (approvedOffers.length === 0) {
      return res.status(404).json({ message: 'No approved offers found for this ChefFiliere' });
    }

    res.status(200).json(approvedOffers);
  } catch (error) {
    console.error('Error fetching approved offers:', error);
    res.status(500).json({ error: 'Failed to fetch approved offers' });
  }
});


// Get all disapproved offers for a specific ChefFiliere
router.get('/disapprovedOffers/:id_cdf', async (req, res) => {
  const { id_cdf } = req.params; // ChefFiliere ID (ID_CDF)

  try {
    // Find all disapproved flags for the specified ChefFiliere
    const disapprovedOffers = await OffreFlag.findAll({
      where: {
        ID_CDF: id_cdf,
        Status_Flag: 'rejected', // Filter by rejected status
      },
      include: [
        {
          model: Offre,
          as: 'Offre',
          // Specify attributes to return
          include: [
            {
              model: Entreprise, // Include the company information
              as: 'Company',
              attributes: ['ID_Entreprise', 'Nom_Entreprise', 'Adresse_Entreprise', 'Tel_Entreprise', 'Email_Entreprise'], // Specify company attributes to return
            },
          ],
        },
      ],
    });

    if (disapprovedOffers.length === 0) {
      return res.status(404).json({ message: 'No disapproved offers found for this ChefFiliere' });
    }

    res.status(200).json(disapprovedOffers);
  } catch (error) {
    console.error('Error fetching disapproved offers:', error);
    res.status(500).json({ error: 'Failed to fetch disapproved offers' });
  }
});

// Route to fetch candidatures for Chef de Filière's students
router.get('/candidatures/:id_cdf', async (req, res) => {
  const { id_cdf } = req.params; // Extract Chef de Filière ID from params
  console.log('Fetching candidatures for Chef de Filière ID:', id_cdf);

  try {
    // Fetch candidatures with associated data
    const candidatures = await Candidature.findAll({
      include: [
        {
          model: Etudiant,
          as: 'Etudiant', // Assuming 'Etudiant' is the alias for the associated student
          where: {
            Filiere_Etudiant: id_cdf, // Ensure the student's Filiere matches the Chef de Filière
          },
          attributes: ['ID_Etudiant', 'Nom_Etudiant', 'Prenom_Etudiant'], // Student details
        },
        {
          model: Offre,
          as: 'Offre', // Assuming 'Offre' is the alias for the associated offer
          attributes: ['ID_Offre', 'Titre_Offre', 'Description_Offre', 'Durée', 'Période'], // Offer details
          include: [
            {
              model: Entreprise,
              as: 'Company', // Assuming 'Company' is the alias for the associated entreprise
              attributes: [
                'Nom_Entreprise',
                'Adresse_Entreprise',
                'Tel_Entreprise',
                'Email_Entreprise',
              ], // Enterprise details
            },
          ],
        },
      ],
      where: {
        Réponse_Entreprise: 'accepted', // Filter only candidatures where the company's response is accepted
      },
    });

    if (!candidatures || candidatures.length === 0) {
      return res
        .status(404)
        .json({ error: 'No candidatures found for this Chef de Filière' });
    }

    // Send the candidatures as the response
    res.status(200).json(candidatures);
  } catch (error) {
    console.error('Error fetching candidatures:', error);
    res.status(500).json({ error: 'Failed to fetch candidatures' });
  }
});


// Endpoint to fetch student details using studentId
router.get('/etudiant/:studentId', async (req, res) => {
  const { studentId } = req.params;  // Get studentId from the request parameters
  try {
    // Find the student by ID
    const student = await Etudiant.findOne({
      where: { ID_Etudiant: studentId },

    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });  // If no student is found
    }

    // Send back the student details
    res.json(student);  // Return the student data
  } catch (error) {
    console.error('Error fetching student details:', error);
    res.status(500).json({ error: 'Failed to fetch student details' });  // Handle errors
  }
});


router.put('/candidature/accept/:cdfId/:candidatureId', async (req, res) => {
  const { cdfId, candidatureId } = req.params;
  const { response } = req.body; // The new response value (should be 'accepted')

  try {
    // Check if the candidature exists
    const candidature = await Candidature.findOne({
      where: { ID_Candidature: candidatureId },
    });

    if (!candidature) {
      return res.status(404).json({ error: 'Candidature not found' });
    }

    // Update the Réponse_CDF field and store the CDF's ID in the Candidature model
    candidature.Réponse_CDF = response; // Set response to 'accepted'
    candidature.ID_CDF = cdfId; // Store the Chef de Filière's ID directly
    await candidature.save();

    // Create a new entry in the Entretien table
    const entretien = await Entretien.create({
      ID_Candidature: candidatureId,
      Réponse_Entreprise: 'pending', // Default value
      Réponse_Etudiant: 'pending',  // Default value
    });

    res.status(200).json({
      success: true,
      message: 'Candidature accepted and Entretien created successfully',
      entretien,
    });
  } catch (err) {
    console.error('Error accepting candidature or creating entretien:', err);
    res.status(500).json({ error: 'Failed to accept candidature or create entretien' });
  }
});


module.exports = router;
