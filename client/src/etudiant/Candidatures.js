import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Candidatures = () => {
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
    <div className="student-candidatures">
      <h2>My Candidatures</h2>

      <table>
        <thead>
          <tr>
            <th>Offer Title</th>
            <th>Réponse Entreprise</th>
            <th>Réponse ChefDeFiliere</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidatures.length > 0 ? (
            candidatures.map((candidature) => (
              <tr key={candidature.ID_Candidature}>
                <td>{candidature.Offre.Titre_Offre}</td>
                <td>{candidature.Réponse_Entreprise}</td>
                <td>{candidature.Réponse_CDF}</td>
                <td>
                  <button onClick={() => handleViewOffer(candidature.ID_Offre)}>
                    View Offer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No candidatures found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Candidatures;
