import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Entretiens = () => {
  const [entretiens, setEntretiens] = useState([]);
  const [studentId, setStudentId] = useState(null);
  const [statutRecherche, setStatutRecherche] = useState(false); // set initial value to false
;

  useEffect(() => {
    axios
      .get('http://localhost:3001/etudiant/me', {
        headers: {
          accessToken: sessionStorage.getItem('accessToken'),
        },
      })
      .then((response) => {
        setStudentId(response.data.ID_Etudiant);
        setStatutRecherche(response.data.Statut_Recherche);
        console.log("Statut Recherche fetched:", response.data.Statut_Recherche);
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
        alert('Failed to fetch student data. Please log in again.');
      });
  }, []);

  useEffect(() => {
    if (studentId) {
      axios
        .get('http://localhost:3001/etudiant/entretiens', {
          params: { ID_Etudiant: studentId },
        })
        .then((response) => {
          setEntretiens(response.data);
        })
        .catch((error) => {
          console.error('Error fetching entretiens:', error);
        });
    }
  }, [studentId]);

  const handleAcceptOffer = (ID_Entretien) => {
    axios
      .post('http://localhost:3001/etudiant/accept-offer', { ID_Entretien })
      .then((response) => {
        alert(response.data.message);
  
        setEntretiens((prev) =>
          prev.map((entretien) =>
            entretien.ID_Entretien === ID_Entretien
              ? {
                  ...entretien,
                  Réponse_Etudiant: 'accepted',
                }
              : entretien
          )
        );
        setStatutRecherche(true);
      })
      .catch((error) => {
        console.error('Error accepting offer:', error);
        alert('Failed to accept the offer. Please try again.');
      });
  };

  return (
    <div className="student-entretiens">
      <h2>My Interviews</h2>

      <table>
        <thead>
          <tr>
            <th>Offer Title</th>
            <th>Description</th>
            <th>Keywords</th>
            <th>Duration</th>
            <th>Period</th>
            <th>Company Response</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {entretiens.length > 0 ? (
            entretiens.map((entretien) => (
              <tr key={entretien.ID_Entretien}>
                <td>{entretien.Candidature.Offre.Titre_Offre}</td>
                <td>{entretien.Candidature.Offre.Description_Offre}</td>
                <td>{entretien.Candidature.Offre.Keywords_Offre}</td>
                <td>{entretien.Candidature.Offre.Durée}</td>
                <td>{entretien.Candidature.Offre.Période}</td>
                <td>{entretien.Réponse_Entreprise || 'No response yet'}</td>
                <td>
                  {statutRecherche === 'false' && entretien.Réponse_Etudiant !== 'accepted' && entretien.Réponse_Entreprise === 'accepted'  ? (
                    <button
                      onClick={() => handleAcceptOffer(entretien.ID_Entretien)}
                    >
                      Accept Offer
                    </button>
                  ) : entretien.Réponse_Etudiant === 'accepted' ? (
                    <span>Accepted</span>
                  ) : (
                    <span>Unavailable</span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No interviews found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Entretiens;
