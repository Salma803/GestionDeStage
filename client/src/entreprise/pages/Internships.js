import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListeStagesEntreprise = () => {
  const [stages, setStages] = useState([]);
  const [userId, setUserId] = useState(null); // To store the authenticated entreprise's ID
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch the authenticated entreprise's data
        const response = await axios.get('http://localhost:3001/entreprise/me', {
          headers: {
            accessToken: sessionStorage.getItem('accessToken'), // Pass access token from sessionStorage
          },
        });

        const entrepriseEmail = response.data.Email_Entreprise;
        setUserId(entrepriseEmail);

        // Fetch the stages for this entreprise using its ID
        const stagesResponse = await axios.get(`http://localhost:3001/entreprise/${entrepriseEmail}/stages`);
        setStages(stagesResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Erreur lors de la récupération des données.');
        console.error('Erreur lors de la récupération des stages :', err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Chargement des stages...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Liste des Stages effectuée au sein de l'Entreprise</h1>
      <table>
        <thead>
          <tr>
            <th>ID Stage</th>
            <th>ID Étudiant</th>
            <th>Nom de l'Étudiant</th>
            <th>Date de Naissance</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Filière</th>
            <th>Année</th>
            <th>Titre de l'Offre</th>
            <th>Description de l'Offre</th>
            <th>Durée</th>
            <th>Période</th>
            <th>Tuteur</th>
          </tr>
        </thead>
        <tbody>
          {stages.map((stage) => (
            <tr key={stage.ID_Stage}>
              <td>{stage.ID_Stage}</td>
              <td>{stage.ID_Etudiant}</td>
              <td>
                {stage.Prenom_Etudiant} {stage.Nom_Etudiant}
              </td>
              <td>{stage.Date_Naissance_Etudiant}</td>
              <td>{stage.Email_Etudiant}</td>
              <td>{stage.Tel_Etudiant}</td>
              <td>{stage.Filiere_Etudiant}</td>
              <td>{stage.Annee_Etudiant}</td>
              <td>{stage.Titre_Offre}</td>
              <td>{stage.Description_Offre}</td>
              <td>{stage.Durée}</td>
              <td>{stage.Période}</td>
              <td>{stage.Tuteur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListeStagesEntreprise;
