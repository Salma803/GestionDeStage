const express = require('express');
const { OffreFlag, Offre, Entreprise, Etudiant, Candidature, Entretien, ChefFiliere, Stage } = require('../models'); // Adjust the path based on your project structure
const jwt = require('jsonwebtoken');
const router = express.Router();
const { validateToken } = require('../middlewares/AuthMiddleware');
const path = require('path');
const fs = require('fs');

const multer = require('multer');


// Set storage engine for multer to store files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/cvs/'); // Path to store the CVs
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`); // Set file name with a timestamp
  },
});

// Initialize multer
const upload = multer({ storage: storage });

// Route to upload CV
router.post('/uploadCV', validateToken, upload.single('cv'), async (req, res) => {
  const ID_Etudiant = req.user.ID_Etudiant;
  const newCvPath = req.file.path; // Path where the new CV is stored
  const newCvFileName = req.file.filename; // File name of the new CV

  try {
    // Find student record
    const student = await Etudiant.findOne({ where: { ID_Etudiant } });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // If the student already has a CV, delete the previous one
    if (student.CV_Etudiant) {
      const oldCvPath = path.join(__dirname, '..', 'uploads', 'cvs', student.CV_Etudiant);

      // Check if the old CV exists and delete it
      fs.exists(oldCvPath, (exists) => {
        if (exists) {
          fs.unlink(oldCvPath, (err) => {
            if (err) {
              console.error('Error deleting old CV:', err);
            } else {
              console.log('Old CV deleted successfully');
            }
          });
        }
      });
    }

    // Save the new CV file name in the database
    student.CV_Etudiant = newCvFileName;
    await student.save();

    res.json({ message: 'CV uploaded successfully', cvFileName: newCvFileName });
  } catch (error) {
    console.error('Error uploading CV:', error);
    return res.status(500).json({ error: 'Failed to upload CV' });
  }
});



// Route to fetch student profile based on the token
router.get('/me', validateToken, async (req, res) => {
  const ID_Etudiant = req.user.ID_Etudiant;
  const Email_Etudiant = req.user.Email_Etudiant;

  try {
    const student = await Etudiant.findOne({ where: { ID_Etudiant } });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({
      ID_Etudiant,
      Email_Etudiant,
      Nom_Etudiant: student.Nom_Etudiant,
      Prenom_Etudiant: student.Prenom_Etudiant,
      Date_Naissance_Etudiant: student.Date_Naissance_Etudiant,
      Tel_Etudiant: student.Tel_Etudiant,
      Filiere_Etudiant: student.Filiere_Etudiant,
      Statut_Recherche: student.Statut_Recherche,
      Annee_Etudiant: student.Annee_Etudiant,
      CV_Etudiant: student.CV_Etudiant
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    return res.status(500).json({ error: 'Failed to fetch student profile' });
  }
});


// Route for Etudiant login
router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
      // Find Etudiant by email
      const user = await Etudiant.findOne({ where: { Email_Etudiant: email } });

      // Check if Etudiant exists
      if (!user) {
          return res.status(404).json({ error: "Account doesn't exist" });
      }

      // Compare hashed passwords
      if (mot_de_passe !== user.MotDePasse_Etudiant) {
          return res.status(401).json({ error: "Wrong username and password combination" });
      }

      // Successful login
      const accessToken = jwt.sign({ Email_Etudiant: user.Email_Etudiant, ID_Etudiant: user.ID_Etudiant }, "secret", { expiresIn: '5h' });
      res.json({
        accessToken,
        email: user.Email_Etudiant,
      });

  } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ error: 'Unexpected error during login' });
  }
});

// Endpoint to fetch filtered offers based on statusFlag and idCdf
router.get('/offers', async (req, res) => {
  const { statusFlag, idCdf } = req.query;

  console.log('Received parameters:', { statusFlag, idCdf });

  // If no filters are provided, fetch all offers
  if (!statusFlag && !idCdf) {
    try {
      const allOffers = await Offre.findAll();
      return res.json(allOffers);
    } catch (error) {
      console.error('Error fetching all offers:', error);
      return res.status(500).json({ error: 'Failed to fetch offers' });
    }
  }

  // If both filters are provided, filter by statusFlag and idCdf
  if (statusFlag && idCdf) {
    try {
      // Step 1: Filter the OffreFlag table by statusFlag and idCdf
      const filteredFlags = await OffreFlag.findAll({
        where: {
          Status_Flag: statusFlag,
          ID_CDF: idCdf,
        },
        attributes: ['ID_Offre'], // Only need the ID_Offre values
      });

      if (filteredFlags.length === 0) {
        return res.status(404).json({ message: 'No offers found for the given filters' });
      }

      // Step 2: Extract the list of ID_Offre from the filtered flags
      const offerIds = filteredFlags.map((flag) => flag.ID_Offre);

      // Step 3: Get the details of the offers from the Offre table
      const offers = await Offre.findAll({
        where: {
          ID_Offre: offerIds, // Filter by the IDs of the offers found in OffreFlag
        },
      });

      return res.json(offers);
    } catch (error) {
      console.error('Error fetching filtered offers:', error);
      return res.status(500).json({ error: 'Failed to fetch filtered offers' });
    }
  }

  // If only one filter is provided, handle it with an error or fetch appropriate offers
  return res.status(400).json({ message: 'Both statusFlag and idCdf are required' });
});

// Endpoint to fetch details of an offer
router.get('/offers/:offerId', async (req, res) => {
  const { offerId } = req.params;
  try {
    const offer = await Offre.findOne({
      where: { ID_Offre: offerId },
      include: [{
        model: Entreprise, // Include the associated company
        as: 'Company', // Alias defined in the association
        attributes: [
          'Nom_Entreprise', 
          'Adresse_Entreprise', 
          'Tel_Entreprise', 
          'Email_Entreprise'
        ], // Include these fields from the company
      }],
    });

    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }

    res.json(offer);
  } catch (error) {
    console.error('Error fetching offer details:', error);
    res.status(500).json({ error: 'Failed to fetch offer details' });
  }
});


// Route to get CV file
router.get('/getCV', validateToken, async (req, res) => {
  const ID_Etudiant = req.user.ID_Etudiant;

  try {
    const student = await Etudiant.findOne({ where: { ID_Etudiant } });

    if (!student || !student.CV_Etudiant) {
      return res.status(404).json({ error: 'CV not found' });
    }

    const cvPath = path.resolve(student.CV_Etudiant);
    if (fs.existsSync(cvPath)) {
      res.sendFile(cvPath); // Send the CV file to the client
    } else {
      return res.status(404).json({ error: 'CV file not found on the server' });
    }
  } catch (error) {
    console.error('Error fetching CV:', error);
    return res.status(500).json({ error: 'Failed to fetch CV' });
  }
});


// Route to handle application (candidature)
router.post('/candidater', async (req, res) => {
  const { ID_Etudiant, ID_Offre } = req.body;
  console.log('Received data:', req.body);

  try {
    // Ensure that the student exists
    const student = await Etudiant.findOne({ where: { ID_Etudiant } });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if the student has already applied to the offer
    const existingApplication = await Candidature.findOne({
      where: { ID_Etudiant, ID_Offre }
    });
    if (existingApplication) {
      return res.status(400).json({ error: 'You have already applied for this offer' });
    }

    // Create a new application
    await Candidature.create({
      ID_Etudiant,
      ID_Offre,
      Réponse_Entreprise: 'pending', // Initially, no response from the company // The student is waiting for a response
      Réponse_CDF: 'pending' // The offer is awaiting review by the Chef de Filière
    });

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Error applying for offer:', error);
    res.status(500).json({ error: 'Failed to apply for the offer' });
  }
});

// Route to check if the student has applied for the offer
router.get('/candidatures/:studentId/:offerId', async (req, res) => {
  const { studentId, offerId } = req.params;
  
  try {
    const existingApplication = await Candidature.findOne({
      where: { ID_Etudiant: studentId, ID_Offre: offerId },
    });
    
    if (existingApplication) {
      return res.json({ hasApplied: true });
    } else {
      return res.json({ hasApplied: false });
    }
  } catch (error) {
    console.error('Error checking application status:', error);
    res.status(500).json({ error: 'Failed to check application status' });
  }
});

// Route to remove the application (candidature)
router.delete('/candidatures/:studentId/:offerId', async (req, res) => {
  const { studentId, offerId } = req.params;

  try {
    // Find and delete the application
    const application = await Candidature.findOne({
      where: { ID_Etudiant: studentId, ID_Offre: offerId },
    });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    await application.destroy();
    res.status(200).json({ message: 'Application removed successfully' });
  } catch (error) {
    console.error('Error removing application:', error);
    res.status(500).json({ error: 'Failed to remove application' });
  }
});

// Route to fetch candidatures for the authenticated student
router.get('/candidatures', async (req, res) => {
  const { ID_Etudiant } = req.query;  // Get student ID from the query parameters
  console.log('Received student ID:', ID_Etudiant);

  try {
    // Fetch the candidatures associated with the student
    const candidatures = await Candidature.findAll({
      where: { ID_Etudiant },
      include: [{
        model: Offre,
        as: 'Offre',  // Assuming 'Offre' is the alias for the associated offer
        attributes: ['ID_Offre', 'Titre_Offre'],
      }],
    });

    if (!candidatures || candidatures.length === 0) {
      return res.status(404).json({ error: 'No candidatures found' });
    }

    // Send the candidatures data as response
    res.status(200).json(candidatures);
  } catch (error) {
    console.error('Error fetching candidatures:', error);
    res.status(500).json({ error: 'Failed to fetch candidatures' });
  }
});

// Route to accept candidature
router.put('/candidature/updateResponse/:candidatureId', async (req, res) => {
  const { candidatureId } = req.params;
  const { response } = req.body; // The new response

  try {
    // Find the candidature
    const candidature = await Candidature.findOne({
      where: { ID_Candidature: candidatureId },
    });

    if (!candidature) {
      return res.status(404).json({ error: 'Candidature not found' });
    }

    // Update the Réponse_Etudiant field
    await candidature.save();

    res.status(200).json({ success: true, message: 'Response updated successfully' });
  } catch (err) {
    console.error('Error updating response:', err);
    res.status(500).json({ error: 'Failed to update response' });
  }
});

// Route to fetch entretiens for the logged-in student
router.get('/entretiens', async (req, res) => {
  try {
    const studentId = req.query.ID_Etudiant;

    if (!studentId) {
      return res.status(400).json({ error: 'Missing student ID' });
    }

    // Fetch entretiens for the student's candidatures
    const entretiens = await Entretien.findAll({
      include: [
        {
          model: Candidature,
          as: 'Candidature',
          where: { ID_Etudiant: studentId },
          include: [
            {
              model: Offre,
              as: 'Offre',
              attributes: ['Titre_Offre','Description_Offre','Keywords_Offre','Durée','Période'], 
            },
          ],
        },
      ],
    });

    res.json(entretiens);
  } catch (error) {
    console.error('Error fetching entretiens:', error);
    res.status(500).json({ error: 'Failed to fetch entretiens' });
  }
});

// Route to accept an offer
router.post('/accept-offer', async (req, res) => {
  try {
    const { ID_Entretien } = req.body;

    if (!ID_Entretien) {
      return res.status(400).json({ error: 'Missing entretien ID' });
    }

    // Find the Entretien by ID, including associations to Candidature, Etudiant, and Offre (with Entreprise)
    const entretien = await Entretien.findByPk(ID_Entretien, {
      include: [
        {
          model: Candidature,
          as: 'Candidature',
          include: [
            {
              model: Etudiant,
              as: 'Etudiant',
            },
            {
              model: ChefFiliere,
              as: 'ChefDeFiliere',
            },
            {
              model: Offre,
              as: 'Offre',
              include: [
                {
                  model: Entreprise,
                  as: 'Company',  // Assumes Entreprise is related to Offre via 'ID_Company'
                },
              ],
            },
          ],
        },
      ],
    });

    if (!entretien) {
      return res.status(404).json({ error: 'Entretien not found' });
    }

    // Retrieve associated data
    const candidature = entretien.Candidature;
    const etudiant = candidature.Etudiant;
    const offre = candidature.Offre;
    const chefdefiliere = candidature.ChefDeFiliere;
    const entreprise = offre.Company;
    
    if (!etudiant) {
      return res.status(404).json({ error: 'Etudiant not found' });
    }
    
    // Check if Statut_Recherche is false
    if (etudiant.Statut_Recherche === 'true') {
      return res.status(400).json({ error: 'Etudiant has already an internship' });
    }

    // Update Statut_Recherche in Etudiant to true
    etudiant.Statut_Recherche = 'true';
    await etudiant.save();

    // Update the Réponse_Etudiant field to "accepted"
    entretien.Réponse_Etudiant = 'accepted';
    await entretien.save();

    // Create a new Stage entry using the retrieved information
    const stage = await Stage.create({
      ID_Entretien: entretien.ID_Entretien,

      ID_Etudiant: etudiant.ID_Etudiant,
      Nom_Etudiant: etudiant.Nom_Etudiant,
      Prenom_Etudiant: etudiant.Prenom_Etudiant,
      Date_Naissance_Etudiant: etudiant.Date_Naissance_Etudiant,
      Email_Etudiant: etudiant.Email_Etudiant,
      Tel_Etudiant: etudiant.Tel_Etudiant,
      Filiere_Etudiant: etudiant.Filiere_Etudiant,
      Annee_Etudiant: etudiant.Annee_Etudiant,

      Nom_CDF: chefdefiliere.Nom_CDF,
      Prenom_CDF: chefdefiliere.Prenom_CDF,
      Email_CDF: chefdefiliere.Email_CDF,
      Tel_CDF: chefdefiliere.Tel_CDF,

      Nom_Entreprise: entreprise.Nom_Entreprise,
      Adresse_Entreprise: entreprise.Adresse_Entreprise,
      Tel_Entreprise: entreprise.Tel_Entreprise,
      Email_Entreprise: entreprise.Email_Entreprise,

      Titre_Offre: offre.Titre_Offre,
      Description_Offre: offre.Description_Offre,
      Durée: offre.Durée,
      Période: offre.Période,
      Tuteur: offre.Tuteur,
    });

    res.json({ message: 'Offer accepted and stage created successfully', stage });
  } catch (error) {
    console.error('Error accepting offer:', error);
    res.status(500).json({ error: 'Failed to accept offer and create stage' });
  }
});















module.exports = router;