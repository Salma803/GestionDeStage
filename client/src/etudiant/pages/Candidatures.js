import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component
import UseAuth from "../hooks/UseAuth";

const Candidatures = () => {
  const isAuthenticated = UseAuth();
  const [candidatures, setCandidatures] = useState([]);
  const [studentId, setStudentId] = useState(null);  // Store student ID
  const navigate = useNavigate();

  // Fetch the student ID first
  useEffect(() => {
    axios
      .get('http://localhost:3001/etudiant/me', {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setStudentId(response.data.ID_Etudiant);  // Store student ID
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
        alert('Failed to fetch student data. Please log in again.');
      });
  }, []);

  // Fetch the student's candidatures based on the student ID
  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:3001/etudiant/candidatures`, {
          params: { ID_Etudiant: studentId },
        })
        .then((response) => {
          setCandidatures(response.data); // Set candidatures data
        })
        .catch((error) => {
          console.error('Error fetching candidatures:', error);
        });
    }
  }, [studentId]); // Re-run this when studentId is set

  const handleViewOffer = (offerId) => {
    navigate(`/etudiant/offer/${offerId}`); // Navigate to the offer details page
  };

  return (
    <div className="liste-offres-page">
        <SideNav />
        <div className="content-area">
        <Header />
        <main className="offers-main">
    <div className="container my-5">
      <h2 className="mb-4">Mes Candidatures</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-secondary">
            <tr>
              <th>Titre de l'offre</th>
              <th>Durée</th>
              <th>Période</th>
              <th>Réponse de l'entreprise</th>
              <th>Réponse du Chef de Filière</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidatures.length > 0 ? (
              candidatures.map((candidature) => (
                <tr key={candidature.ID_Candidature}>
                  <td>{candidature.Offre.Titre_Offre}</td>
                  <td>{candidature.Offre.Durée}</td>
                  <td>{candidature.Offre.Période}</td>
                  <td>{candidature.Réponse_Entreprise === 'accepted' ? 'Candidature acceptée par l\'Entreprise' : 'En attente'}</td>
                  <td>{candidature.Réponse_CDF === 'accepted' ? 'Candidature acceptée par votre CDF' : 'En attente'}</td>
                  <td>
                    <button
                      className="btn btn-outline-info"
                      onClick={() => handleViewOffer(candidature.ID_Offre)}
                    >
                      Voir l'offre
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  Aucune candidature trouvée.
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

export default Candidatures;
