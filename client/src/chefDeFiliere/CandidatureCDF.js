import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Spinner, Alert, Table, Button } from 'react-bootstrap';

const ListeCandidatures = () => {
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cdfId, setCdfId] = useState(null); // Track ChefFiliere's ID
    const [studentDetails, setStudentDetails] = useState({}); // Store student details

    useEffect(() => {
        // Fetch the ChefFiliere's ID
        axios
            .get("http://localhost:3001/chefdefiliere/me", {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"), // Ensure the user is authenticated
                },
            })
            .then((response) => {
                setCdfId(response.data.ID_CDF); // Set the ChefFiliere's ID
            })
            .catch((error) => {
                setError("Failed to fetch ChefFiliere data.");
                console.error("Error fetching ChefFiliere data:", error);
            });
    }, []);

    useEffect(() => {
        if (cdfId) {
            // Fetch the list of candidatures
            axios
                .get(`http://localhost:3001/chefdefiliere/candidatures/${cdfId}`, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"), // Ensure the user is authenticated
                    },
                })
                .then((response) => {
                    setCandidatures(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    setError("There was an error fetching the candidatures!");
                    setLoading(false);
                });
        }
    }, [cdfId]);

    // Fetch student details when candidatures are loaded
    useEffect(() => {
        if (candidatures.length > 0) {
            candidatures.forEach((candidature) => {
                if (candidature.Etudiant) {
                    const studentId = candidature.Etudiant.ID_Etudiant;

                    // Fetch student details if not already fetched
                    if (!studentDetails[studentId]) {
                        axios
                            .get(`http://localhost:3001/chefdefiliere/etudiant/${studentId}`, {
                                headers: {
                                    accessToken: sessionStorage.getItem("accessToken"), // Ensure the user is authenticated
                                },
                            })
                            .then((response) => {
                                setStudentDetails((prevDetails) => ({
                                    ...prevDetails,
                                    [studentId]: response.data, // Save student details by ID
                                }));
                            })
                            .catch((error) => {
                                console.error(`Error fetching student details for ID ${studentId}:`, error);
                            });
                    }
                }
            });
        }
    }, [candidatures]);

    const handleDownloadCV = (cvFilename) => {
        // This will trigger a file download
        const fileUrl = `http://localhost:3001/uploads/cvs/${cvFilename}`;
        window.open(fileUrl, '_blank');
    };

    const handleAcceptCandidature = (candidatureId) => {
        // Send the updated response to backend
        axios
            .put(`http://localhost:3001/chefdefiliere/candidature/accept/${cdfId}/${candidatureId}`, {
                response: "accepted", // Send the response value in the body
            }, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"), // Ensure the user is authenticated
                },
            })
            .then((response) => {
                // Update the local state to reflect the change
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
        return <p>Loading candidatures...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="candidatures-container">
            <h1>Liste des Candidatures</h1>
            <div>
                <Link to="/chefDeFiliere/listeOffres">Back to Offers</Link>
            </div>
            <ul className="candidatures-list">
                {candidatures.length > 0 ? (
                    candidatures.map((candidature) => {
                        const student = candidature.Etudiant;
                        const studentDetail = studentDetails[student.ID_Etudiant]; // Get detailed student info

                        return (
                            <li key={candidature.ID_Candidature} className="candidature-item">
                                <h2>Internship Offer: {candidature.Offre.Titre_Offre || "No Title"}</h2>
                                <p>
                                    <strong>Response from Company:</strong> {candidature.Réponse_Entreprise}
                                </p>


                                {studentDetail ? (
                                    <div>
                                        <h3>Student Details</h3>
                                        <p><strong>Student:</strong> {studentDetail.Nom_Etudiant || "N/A"} {studentDetail.Prenom_Etudiant || "N/A"}</p>
                                        <p><strong>Email:</strong> {studentDetail.Email_Etudiant || "N/A"}</p>
                                        <p><strong>Phone:</strong> {studentDetail.Tel_Etudiant || "N/A"}</p>
                                        <p><strong>Date of Birth:</strong> {studentDetail.Date_Naissance_Etudiant || "N/A"}</p>
                                        <p><strong>Filière:</strong> {studentDetail.Filiere_Etudiant || "N/A"}</p>
                                        <p><strong>Année:</strong> {studentDetail.Annee_Etudiant || "N/A"}</p>
                                        <p>
                                            {studentDetail.CV_Etudiant ? (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleDownloadCV(studentDetail.CV_Etudiant)}
                                                >
                                                    View CV
                                                </Button>
                                            ) : (
                                                'No CV available'
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <p>Loading student details...</p>  // Show loading if student details are not fetched yet
                                )}

                                {/* Add the button to accept the candidature */}
                                {candidature.Réponse_CDF !== "accepted" && (
                                    <Button
                                        variant="success"
                                        onClick={() => handleAcceptCandidature(candidature.ID_Candidature)}
                                    >
                                        Accept Candidature
                                    </Button>
                                )}
                            </li>
                        );
                    })
                ) : (
                    <p>No candidatures found.</p>
                )}
            </ul>
        </div>
    );
};

export default ListeCandidatures;
