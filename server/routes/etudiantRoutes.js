const express = require('express');
const { OffreFlag, Offre, Entreprise, Etudiant } = require('../models'); // Adjust the path based on your project structure
const jwt = require('jsonwebtoken');
const router = express.Router();


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
      const accessToken = jwt.sign({ Email_Etudiant: user.Email_Etudiant, ID_Etudiant: user.ID_Etudiant }, "secret", { expiresIn: '1h' });
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





module.exports = router;
