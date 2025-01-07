import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import { Table, Button, Spinner, Alert } from "react-bootstrap";

const CandidaturesEntreprise = () => {
  const { offerId } = useParams(); // Get offerId from URL
  const [candidatures, setCandidatures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entrepriseId, setEntrepriseId] = useState(null); // State to store entreprise ID

  useEffect(() => {
    // Fetch the entreprise ID from the token
    const fetchEntrepriseId = async () => {
      try {
        const response = await axios.get("http://localhost:3001/entreprise/me", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setEntrepriseId(response.data.ID_Entreprise); // Set entreprise ID from response
      } catch (err) {
        setError("Failed to fetch entreprise ID");
        console.error("Error fetching entreprise ID:", err);
      }
    };

    fetchEntrepriseId();
  }, []);

  useEffect(() => {
    if (!entrepriseId) return; // Don't fetch candidatures if entrepriseId is not yet available

    const fetchCandidatures = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/entreprise/candidatures/${entrepriseId}/${offerId}`
        );
        setCandidatures(response.data);
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    fetchCandidatures();
  }, [offerId, entrepriseId]); // Run when either offerId or entrepriseId changes

  useEffect(() => {
    console.log("Candidatures data:", candidatures);
  }, [candidatures]);
  

  const handleDownloadCV = (cvFilename) => {
    const fileUrl = `http://localhost:3001/uploads/cvs/${cvFilename}`;
    window.open(fileUrl, "_blank");
  };

  const handleAcceptCandidature = async (candidatureId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/entreprise/candidature/accept/${entrepriseId}/${candidatureId}`,
        {
          response: "accepted",
        }
      );
      if (response.data.success) {
        setCandidatures((prevCandidatures) =>
          prevCandidatures.map((candidature) =>
            candidature.ID_Candidature === candidatureId
              ? { ...candidature, Réponse_Entreprise: "accepted" }
              : candidature
          )
        );
      }
    } catch (err) {
      setError("Failed to accept candidature");
      console.error("Error accepting candidature:", err);
    }
  };

  const handleAcceptEntretien = async (candidatureId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/entreprise/entretien/accept/${entrepriseId}/${candidatureId}`,
        {
          response: "accepted",
        }
      );
      if (response.data.success) {
        setCandidatures((prevCandidatures) =>
          prevCandidatures.map((candidature) =>
            candidature.ID_Candidature === candidatureId
              ? { ...candidature, Entretiens: [{ ...candidature.Entretiens[0], Réponse_Entreprise: "accepted" }] }
              : candidature
          )
        );
      }
    } catch (err) {
      setError("Failed to accept entretien");
      console.error("Error accepting entretien:", err);
    }
  };

  return (
    <div className="d-flex">
      <SideNav />
      <div className="main-content w-100">
        <Header />
        <div className="container mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                Candidatures for Offer ID: {offerId}
              </h2>

              {loading ? (
                <div className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p>Loading candidatures...</p>
                </div>
              ) : error ? (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              ) : candidatures.length > 0 ? (
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Candidature ID</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Filière</th>
                      <th>Année</th>
                      <th>CV</th>
                      <th>Demande d'Entretien</th>
                      <th>Réponse d'Entretien</th>
                    </tr>
                  </thead>
                  <tbody>
                    {candidatures.map((candidature) => (
                      <tr key={candidature.ID_Candidature}>
                        <td>{candidature.ID_Candidature}</td>
                        <td>
                          {candidature.Etudiant.Nom_Etudiant} {" "}
                          {candidature.Etudiant.Prenom_Etudiant}
                        </td>
                        <td>{candidature.Etudiant.Email_Etudiant}</td>
                        <td>{candidature.Etudiant.Filiere_Etudiant}</td>
                        <td>{candidature.Etudiant.Annee_Etudiant}</td>
                        <td>
                          {candidature.Etudiant.CV_Etudiant ? (
                            <Button
                              variant="primary"
                              onClick={() =>
                                handleDownloadCV(candidature.Etudiant.CV_Etudiant)
                              }
                            >
                              Consulter CV
                            </Button>
                          ) : (
                            "Pas de CV posté"
                          )}
                        </td>
                        <td>
                          {candidature.Réponse_Entreprise === "accepted" ? (
                            <span>Accepté</span>
                          ) : (
                            <Button
                              variant="success"
                              onClick={() =>
                                handleAcceptCandidature(candidature.ID_Candidature)
                              }
                            >
                              Accept
                            </Button>
                          )}
                        </td>
                        <td>
                          {candidature.Réponse_Entreprise === "accepted" &&
                            candidature.Réponse_CDF === "accepted" &&
                            (!candidature.Entretiens || (candidature.Entretiens[0] && candidature.Entretiens[0].Réponse_Entreprise !== "accepted")) ? (
                            <Button
                              variant="info"
                              onClick={() =>
                                handleAcceptEntretien(candidature.ID_Candidature)
                              }
                            >
                              Retenir
                            </Button>
                          ) : candidature.Entretiens && candidature.Entretiens[0] && candidature.Entretiens[0].Réponse_Entreprise === "accepted" ? (
                            <span>Retenu(e) après entretien</span>
                          ) : (
                            <span>Non retenu(e) après entretien</span>
                          )}
                        </td>


                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info" className="text-center">
                  Pas de candidature pour cette offre
                </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidaturesEntreprise;
