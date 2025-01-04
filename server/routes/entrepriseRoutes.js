const express = require('express');
const router = express.Router();
const { Offre, Entreprise } = require('../models');



router.get('/listeOffres', async (req, res) => {        
    try {
        const offres = await Offre.findAll({
            include: [{
                model: Entreprise,
                as: 'Company',
            }],
        });
        res.status(200).json(offres);
    } catch (error) {
        console.error('Error fetching offers:', error);
        res.status(500).json({ error: 'Failed to fetch offers' });
    }
});

router.get('/offresParEntreprise/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const offres = await Offre.findAll({
      where: { ID_Company: id },
      include: [{
        model: Entreprise,
        as: 'Company',
      }],
    });
    if (offres.length === 0) {
      return res.status(404).json({ error: 'No offers found for this company' });
    }
    res.status(200).json(offres);
  } catch (error) {
    console.error('Error fetching offers by company:', error);
    res.status(500).json({ error: 'Failed to fetch offers by company' });
  }
});
router.post('/creerOffre', async (req, res) => {
  const {
    titre_offre: Titre_Offre,
    description_offre: Description_Offre,
    status_offre: Status_Offre,
    keywords_offre: Keywords_Offre,
    id_company: ID_Company,
  } = req.body;

  try {
    // Validate required fields
    if (!Titre_Offre || !Description_Offre || !Status_Offre || !ID_Company) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate Status_Offre value
    if (!['open', 'closed'].includes(Status_Offre)) {
      return res.status(400).json({ error: 'Invalid status_offre value' });
    }

    // Validate Keywords_Offre (ensure it's an array if provided)
    if (Keywords_Offre && !Array.isArray(Keywords_Offre)) {
      return res.status(400).json({ error: 'keywords_offre must be an array' });
    }

    // Check if the company exists
    const entreprise = await Entreprise.findByPk(ID_Company);
    if (!entreprise) {
      return res.status(404).json({ error: 'Entreprise not found' });
    }

    // Create the new offer
    const nvOffre = await Offre.create({
      Titre_Offre,
      Description_Offre,
      Status_Offre,
      Keywords_Offre: Keywords_Offre || [], // Default to an empty array if not provided
      ID_Company,
    });

    res.status(201).json(nvOffre);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});

  

module.exports = router;
