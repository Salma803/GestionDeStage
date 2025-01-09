import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component


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
    <div className="liste-offres-page">
        <SideNav />
        <div className="content-area">
        <Header />
        <main className="offers-main">
    <div className="container my-5">
      <h2 className="mb-4">Mes Entretiens</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-secondary">
            <tr>
              <th>Titre de l'offre</th>
              <th>Description</th>
              <th>Mots-clés</th>
              <th>Durée</th>
              <th>Période</th>
              <th>Réponse de l'entreprise</th>
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
                  <td>{entretien.Réponse_Entreprise === 'accepted' ? 'Vous êtes retenu(e) par l\'Entreprise' : 'Pas encore de réponse'}</td>
                  <td>
                    {statutRecherche === 'false' && entretien.Réponse_Etudiant !== 'accepted' && entretien.Réponse_Entreprise === 'accepted' ? (
                      <button
                        className="btn btn-outline-success"
                        onClick={() => handleAcceptOffer(entretien.ID_Entretien)}
                      >
                        Accepter le stage
                      </button>
                    ) : entretien.Réponse_Etudiant === 'accepted' ? (
                      <span className="text-success">Stage Accepté</span>
                    ) : statutRecherche === 'true' && entretien.Réponse_Etudiant !== 'accepted' ? (
                      <span className="text-warning">Vous avez déjà accepté un stage</span>
                    ) : (
                      <span className="text-muted">Aucune action possible</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Aucun entretien trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </main>
        </div>
      </div>
  );
  
};

export default Entretiens;
