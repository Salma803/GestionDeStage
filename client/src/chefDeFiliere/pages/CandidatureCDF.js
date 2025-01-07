import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Spinner, Alert, Table, Button } from 'react-bootstrap';
import UseAuth from "../hooks/UseAuth";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import '../css/ListeOffres.css';

import SideNav from "../Components/SideNav";


const ListeCandidatures = () => {
    const isAuthenticated = UseAuth();
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cdfId, setCdfId] = useState(null);
    const [studentDetails, setStudentDetails] = useState({});

    useEffect(() => {
        // Fetch the ChefFiliere's ID
        axios
            .get("http://localhost:3001/chefdefiliere/me", {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                },
            })
            .then((response) => {
                setCdfId(response.data.ID_CDF);
            })
            .catch((error) => {
                setError("Failed to fetch ChefFiliere data.");
                console.error("Error fetching ChefFiliere data:", error);
            });
    }, []);

    useEffect(() => {
        if (cdfId) {
            axios
                .get(`http://localhost:3001/chefdefiliere/candidatures/${cdfId}`, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                    },
                })
                .then((response) => {
                    setCandidatures(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError("Error fetching candidatures. Please try again later.");
                    console.error("Fetch candidatures error:", error);
                    setLoading(false);
                });
        }
    }, [cdfId]);

    useEffect(() => {
        if (candidatures.length > 0) {
            candidatures.forEach((candidature) => {
                const studentId = candidature.Etudiant?.ID_Etudiant;
                if (studentId && !studentDetails[studentId]) {
                    axios
                        .get(`http://localhost:3001/chefdefiliere/etudiant/${studentId}`, {
                            headers: {
                                accessToken: sessionStorage.getItem("accessToken"),
                            },
                        })
                        .then((response) => {
                            setStudentDetails((prevDetails) => ({
                                ...prevDetails,
                                [studentId]: response.data,
                            }));
                        })
                        .catch((error) => {
                            console.error(`Error fetching student details for ID ${studentId}:`, error);
                        });
                }
            });
        }
    }, [candidatures]);

    const handleDownloadCV = (cvFilename) => {
        const fileUrl = `http://localhost:3001/uploads/cvs/${cvFilename}`;
        window.open(fileUrl, '_blank');
    };

    const handleAcceptCandidature = (candidatureId) => {
        axios
            .put(
                `http://localhost:3001/chefdefiliere/candidature/accept/${cdfId}/${candidatureId}`,
                { response: "accepted" },
                {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                    },
                }
            )
            .then(() => {
                setCandidatures((prevCandidatures) =>
                    prevCandidatures.map((candidature) =>
                        candidature.ID_Candidature === candidatureId
                            ? { ...candidature, Réponse_CDF: "accepted" }
                            : candidature
                    )
                );
            })
            .catch((error) => {
                console.error("Error updating candidature response:", error);
                setError("There was an error accepting the candidature.");
            });
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
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

    return (
        <div className="liste-offres-page">
          <SideNav />
          <div className="content-area">
            <Header />
            <main className="offers-main">
              <div>
                <Link to="/chefDeFiliere/listeOffres" className="back-link">
                  Back to Offers
                </Link>
              </div>
              <h1 className="offers-title">Liste des Candidatures</h1>
              <div className="offers-cards-container">
                {candidatures.length > 0 ? (
                  candidatures.map((candidature) => {
                    const student = candidature.Etudiant;
                    const studentDetail = studentDetails[student?.ID_Etudiant];
      
                    return (
                      <div
                        key={candidature.ID_Candidature}
                        className="offer-card"
                      >
                        <h2 className="offer-title">
                          Internship Offer:{" "}
                          {candidature.Offre?.Titre_Offre || "No Title"}
                        </h2>
                        <p className="offer-description">
                          <strong>Response from Company:</strong>{" "}
                          {candidature.Réponse_Entreprise || "Pending"}
                        </p>
                        {studentDetail ? (
                          <div className="company-info">
                            <h3 className="offers-title">Student Details</h3>
                            <p>
                              <strong>Name:</strong> {studentDetail.Nom_Etudiant}{" "}
                              {studentDetail.Prenom_Etudiant}
                            </p>
                            <p>
                              <strong>Email:</strong> {studentDetail.Email_Etudiant}
                            </p>
                            <p>
                              <strong>Phone:</strong> {studentDetail.Tel_Etudiant}
                            </p>
                            <p>
                              <strong>Date of Birth:</strong>{" "}
                              {studentDetail.Date_Naissance_Etudiant}
                            </p>
                            <p>
                              <strong>Filière:</strong>{" "}
                              {studentDetail.Filiere_Etudiant}
                            </p>
                            <p>
                              <strong>Year:</strong> {studentDetail.Annee_Etudiant}
                            </p>
                            <p>
                              {studentDetail.CV_Etudiant ? (
                                <button
                                  className="view-cv-button"
                                  onClick={() =>
                                    handleDownloadCV(studentDetail.CV_Etudiant)
                                  }
                                >
                                  View CV
                                </button>
                              ) : (
                                "No CV available"
                              )}
                            </p>
                          </div>
                        ) : (
                          <p className="loading-details">
                            Loading student details...
                          </p>
                        )}
                        {candidature.Réponse_CDF !== "accepted" && (
                          <button
                            className="accept-candidature-button"
                            onClick={() =>
                              handleAcceptCandidature(candidature.ID_Candidature)
                            }
                          >
                            Accept Candidature
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="no-candidatures-message">
                    No candidatures found.
                  </p>
                )}
              </div>
            </main>
          </div>
        </div>
      );
      
};

export default ListeCandidatures;
