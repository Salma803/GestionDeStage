import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Spinner, Alert, Table, Button } from 'react-bootstrap';

const CandidaturesEntreprise = () => {
  const { offerId } = useParams(); // Get offerId from URL
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [entrepriseId, setEntrepriseId] = useState(null); // State to store entreprise ID

  useEffect(() => {
    // Fetch the entreprise ID from the token
    const fetchEntrepriseId = async () => {
      try {
        const response = await axios.get('http://localhost:3001/entreprise/me', {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setEntrepriseId(response.data.ID_Entreprise); // Set entreprise ID from response
      } catch (err) {
        setError('Failed to fetch entreprise ID');
        console.error('Error fetching entreprise ID:', err);
      }
    };

    fetchEntrepriseId();
  }, []);

  useEffect(() => {
    if (!entrepriseId) return; // Don't fetch candidatures if entrepriseId is not yet available

    const fetchCandidatures = async () => {
      try {
        // Send both entrepriseId and offerId as parameters in the URL
        const response = await axios.get(`http://localhost:3001/entreprise/candidatures/${entrepriseId}/${offerId}`);
        setCandidatures(response.data);
      } catch (err) {
        setError('Failed to fetch candidatures');
        console.error('Error fetching candidatures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, [offerId, entrepriseId]); // Run when either offerId or entrepriseId changes

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading candidatures...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const handleDownloadCV = (cvFilename) => {
    // This will trigger a file download
    const fileUrl = `http://localhost:3001/uploads/cvs/${cvFilename}`;
    window.open(fileUrl, '_blank');
  };

  const handleAcceptCandidature = async (candidatureId) => {
    try {
      // Send a request to the backend to update Réponse_Entreprise to "accepted"
      const response = await axios.put(
        `http://localhost:3001/entreprise/candidature/accept/${entrepriseId}/${candidatureId}`,
        {
          response: 'accepted', // New response value
        }
      );
      if (response.data.success) {
        // Update the local state with the new response value
        setCandidatures((prevCandidatures) =>
          prevCandidatures.map((candidature) =>
            candidature.ID_Candidature === candidatureId
              ? { ...candidature, Réponse_Entreprise: 'accepted' }
              : candidature
          )
        );
      }
    } catch (err) {
      setError('Failed to accept candidature');
      console.error('Error accepting candidature:', err);
    }
  };

  const handleAcceptEntretien = async (candidatureId) => {
    try {
      // Send a request to the backend to update Réponse_Entretien to "accepted"
      const response = await axios.put(
        `http://localhost:3001/entreprise/entretien/accept/${entrepriseId}/${candidatureId}`,
        {
          response: 'accepted', // New response value
        }
      );
      if (response.data.success) {
        // Update the local state with the new response value
        setCandidatures((prevCandidatures) =>
          prevCandidatures.map((candidature) =>
            candidature.ID_Candidature === candidatureId
              ? { ...candidature, Réponse_Entretien: 'accepted' }
              : candidature
          )
        );
      }
    } catch (err) {
      setError('Failed to accept entretien');
      console.error('Error accepting entretien:', err);
    }
  };

  return (
    <Container className="mt-5">
      <h2>Candidatures for Offer ID: {offerId}</h2>
      {candidatures.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Candidature ID</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Filière</th>
              <th>Annee</th>
              <th>CV</th> {/* New column for CV button */}
              <th>Réponse Entreprise</th>
              <th>Réponse Entretien</th> {/* New column for entretien decision */}
            </tr>
          </thead>
          <tbody>
            {candidatures.map((candidature) => (
              <tr key={candidature.ID_Candidature}>
                <td>{candidature.ID_Candidature}</td>
                <td>{candidature.Etudiant.Nom_Etudiant} {candidature.Etudiant.Prenom_Etudiant}</td>
                <td>{candidature.Etudiant.Email_Etudiant}</td>
                <td>{candidature.Etudiant.Filiere_Etudiant}</td>
                <td>{candidature.Etudiant.Annee_Etudiant}</td>
                <td>
                  {/* Check if the CV filename exists, then display a button */}
                  {candidature.Etudiant.CV_Etudiant ? (
                    <Button
                      variant="primary"
                      onClick={() => handleDownloadCV(candidature.Etudiant.CV_Etudiant)}
                    >
                      View CV
                    </Button>
                  ) : (
                    'No CV available'
                  )}
                </td>
                <td>
                  {candidature.Réponse_Entreprise === 'accepted' ? (
                    <span>Accepted</span>
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => handleAcceptCandidature(candidature.ID_Candidature)}
                    >
                      Accept
                    </Button>
                  )}
                </td>
                <td>
                  {candidature.Réponse_Entreprise === 'accepted' && candidature.Réponse_CDF === 'accepted' && candidature.Réponse_Entretien !== 'accepted' ? (
                    <Button
                      variant="info"
                      onClick={() => handleAcceptEntretien(candidature.ID_Candidature)}
                    >
                      Accept Entretien
                    </Button>
                  ) : (
                    candidature.Réponse_Entretien === 'accepted' ? (
                      <span>Entretien Accepted</span>
                    ) : (
                      <span>Conditions not met for accepting Entretien</span>
                    )
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No candidatures found for this offer.</Alert>
      )}
    </Container>
  );
};

export default CandidaturesEntreprise;
