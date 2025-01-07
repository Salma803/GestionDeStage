const express = require('express');
const router = express.Router();
const { Offre, Entreprise,OffreFlag, Candidature, Etudiant, ChefFiliere, Entretien, Stage } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validateToken } = require('../middlewares/AuthMiddleware');


// Route for login entreprise
router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
      // Find Admin by email
      const user = await Entreprise.findOne({ where: { Email_Entreprise: email } });

      // Check if Admin exists
      if (!user) {
          return res.status(404).json({ error: "Account doesn't exist" });
      }
      //comparer les mot de passe hashé
      if (mot_de_passe != user.MotDePasse_Entreprise) {
          return res.status(401).json({ error: "Wrong username and password combination" });
      }
      // Successful login
      const accessToken = jwt.sign( { Email_Entreprise :user.Email_Entreprise,  ID_Entreprise :user.ID_Entreprise}, "secret", {expiresIn: '1h'});
            res.json({ accessToken, id: user.ID_Entreprise,email: user.Email_Entreprise });

  } catch (error) {
      console.error('Error logging in:', error);
      return res.status(500).json({ error: 'Unexpected error during login' });
  }
});
//Route pour Trouver l'id du cdf a partie du token
router.get('/me', validateToken, (req, res) => {
  // req.user contains decoded token information
  const ID_Entreprise = req.user.ID_Entreprise;
  const Email_Entreprise = req.user.Email_Entreprise;
  res.json({ ID_Entreprise,Email_Entreprise });
});

//Route to find the enreprise information by ID
router.get('/find/:entrepriseID', async (req, res) => {
  const { entrepriseID } = req.params; // Extract clientID from req.params
  try {
    const entreprise = await Entreprise.findOne({ where: { ID_Entreprise: entrepriseID } }); // Use ID_CDF instead of id
    if (!entreprise) {
      return res.status(404).json({ error: 'Entreprise not found' });
    }
    res.json(entreprise);
  } catch (error) {
    console.error('Error fetching Entreprise:', error);
    res.status(500).json({ error: 'Failed to fetch entreprise' });
  }
});




//Route pour voir toutes les offres postés par toutes les entreprises
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

//route pour voir les offres postés par une entreprise
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


//Route pour creer une offre
router.post('/creerOffre', async (req, res) => {
  const {
    titre_offre: Titre_Offre,
    description_offre: Description_Offre,
    keywords_offre: Keywords_Offre,
    status_offre: Status_Offre,
    id_company: ID_Company,
    duree: Durée,
    periode: Période,
    tuteur: Tuteur,
  } = req.body;

  try {
    // Validate required fields
    if (!Titre_Offre || !Status_Offre || !ID_Company) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate Status_Offre value
    if (!['open', 'closed'].includes(Status_Offre)) {
      return res.status(400).json({ error: 'Invalid status_offre value' });
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
      Keywords_Offre,
      ID_Company,
      Durée,
      Période,
      Tuteur,
    });

    res.status(201).json(nvOffre);
  } catch (error) {
    console.error('Error creating offer:', error);
    res.status(500).json({ error: 'Failed to create offer' });
  }
});


//route pour modifier une offre

router.put('/offre/:id', async (req, res) => {
  const { id } = req.params;
  const {
    status_offre: Status_Offre,
  } = req.body;

  try {
    // Retrieve the current offer by ID
    const offer = await Offre.findByPk(id);
    if (!offer) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    if (!['open', 'closed'].includes(Status_Offre)) {
      return res.status(400).json({ error: 'Invalid status_offre value' });
    }

    // Update the offer details
    offer.Status_Offre = Status_Offre || offer.Status_Offre;
    await offer.save();

    res.status(200).json(offer);
  } catch (error) {
    console.error('Error updating offer:', error);
    res.status(500).json({ error: 'Failed to update offer' });
  }
});


//route to delete an offer
router.delete('/supprimerOffre/:id', async (req, res) => {
  const { id } = req.params; // Extract offer ID from URL parameter

  try {
    // Find the offer by ID
    const offre = await Offre.findByPk(id);

    if (!offre) {
      return res.status(404).json({ error: 'Offer not found' });
    }

    // Delete related flags in OffreFlag table
    await OffreFlag.destroy({
      where: { ID_Offre: id },
    });

    // Delete the offer
    await offre.destroy();

    res.status(200).json({ message: 'Offer and related flags deleted successfully' });
  } catch (error) {
    console.error('Error deleting offer and flags:', error);
    res.status(500).json({ error: 'Failed to delete offer and flags' });
  }
});

// Route to view all candidatures for an offer by entreprise
router.get('/candidatures/:entrepriseId/:offerId', async (req, res) => {
  const { entrepriseId, offerId } = req.params;

  try {
    // Check if the offer belongs to the entreprise
    const offer = await Offre.findOne({
      where: { 
        ID_Offre: offerId,
        ID_Company: entrepriseId 
      }
    });

    if (!offer) {
      return res.status(404).json({ error: 'Offer not found or does not belong to this entreprise' });
    }

    // Fetch candidatures for the offer
    const candidatures = await Candidature.findAll({
      where: { ID_Offre: offerId },
      include: [
        {
          model: Etudiant,
          as: 'Etudiant',  // Using the alias defined in the model
          attributes: ['ID_Etudiant', 'Nom_Etudiant', 'Prenom_Etudiant', 'Email_Etudiant', 'Filiere_Etudiant','Annee_Etudiant', 'CV_Etudiant'],
        },
        {
          model: Entretien, // Include Entretien if available
          as: 'Entretiens',
          attributes: ['Réponse_Entreprise'], // Add relevant fields
        },
      ],
    });

    if (candidatures.length === 0) {
      return res.status(404).json({ error: 'No candidatures found for this offer' });
    }

    res.status(200).json(candidatures);
  } catch (error) {
    console.error('Error fetching candidatures for entreprise:', error);
    res.status(500).json({ error: 'Failed to fetch candidatures' });
  }
});

// Route to modify Réponse_Entreprise when company accepts
router.put('/candidature/accept/:entrepriseId/:candidatureId', async (req, res) => {
  const { entrepriseId, candidatureId } = req.params;
  const { response } = req.body;  // The new response value (should be 'accepted')

  try {
    // Check if the candidature exists and if it belongs to the right entreprise
    const candidature = await Candidature.findOne({
      where: { ID_Candidature: candidatureId },
      include: [
        {
          model: Offre,
          as: 'Offre',  // Assuming 'Offre' is the alias in the model
          where: { ID_Company: entrepriseId },  // Check if the entreprise owns the offer
        },
      ],
    });

    if (!candidature) {
      return res.status(404).json({ error: 'Candidature not found or does not belong to this entreprise' });
    }

    // Update the Réponse_Entreprise field
    candidature.Réponse_Entreprise = response;  // 'accepted' or other status
    await candidature.save();

    res.status(200).json({ success: true, message: 'Candidature accepted successfully' });
  } catch (err) {
    console.error('Error accepting candidature:', err);
    res.status(500).json({ error: 'Failed to accept candidature' });
  }
});

// Accept Réponse Entretien
router.put('/entretien/accept/:entrepriseId/:candidatureId', async (req, res) => {
  const { entrepriseId, candidatureId } = req.params;
  const { response } = req.body; // Expected response: 'accepted' or 'rejected'

  try {
    // Find the Entretien entry by ID_Candidature
    const entretien = await Entretien.findOne({
      where: { ID_Candidature: candidatureId },
    });

    if (!entretien) {
      return res.status(404).json({ success: false, message: 'Entretien not found for this candidature' });
    }


    // Update the Réponse_Entreprise field in the Entretien table
    entretien.Réponse_Entreprise = response;
    await entretien.save();

    res.status(200).json({ success: true, message: 'Réponse Entreprise updated successfully' });
  } catch (error) {
    console.error('Error updating Réponse Entreprise in Entretien:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Endpoint to fetch stages for a specific entreprise using ID_Entreprise
router.get('/:id/stages', async (req, res) => {
  try {
    const entrepriseEmail = req.params.id; // Get entreprise ID from route parameter

    const stages = await Stage.findAll({
      where: { Email_Entreprise: entrepriseEmail }, // Filter stages by entreprise ID
    });

    if (stages.length === 0) {
      return res.status(404).json({ error: "Aucun stage trouvé pour cette entreprise." });
    }

    res.json(stages);
  } catch (error) {
    console.error('Erreur lors de la récupération des stages de l\'entreprise:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});











module.exports = router;