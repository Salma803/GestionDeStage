const express = require('express');
const router = express.Router();
const { OffreFlag, Offre,ChefFiliere,Entreprise } = require('../models');


//Route to flag an offer
router.post('/flaggerOffre', async (req, res) => {
  const {
    id_cdf: ID_CDF,
    id_offre: ID_Offre,
    status_flag: Status_Flag,
    comments: Comments,
  } = req.body;

  try {
    // Validate input
    if (!ID_CDF || !ID_Offre || !Status_Flag) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate Status_Flag value
    if (!['approved', 'rejected'].includes(Status_Flag)) {
      return res.status(400).json({ error: 'Invalid Status_Flag value' });
    }

    // Check if the offer exists
    const offre = await Offre.findByPk(ID_Offre);
    if (!offre) {
      return res.status(404).json({ error: 'Offre not found' });
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
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'This flag already exists.' });
    }

    console.error('Error flagging offer:', error);
    return res.status(500).json({ error: 'Failed to flag offer' });
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
          attributes: ['ID_Offre', 'Titre_Offre', 'Description_Offre', 'Status_Offre'], // Specify attributes to return
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
      include: [{
        model: Offre,
        as: 'Offre',
        attributes: ['ID_Offre', 'Titre_Offre', 'Description_Offre', 'Status_Offre'], // Specify attributes to return
      }],
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



module.exports = router;
