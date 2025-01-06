import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Container, Spinner, Alert, Table, Button } from 'react-bootstrap';

const ListeCandidatures = () => {
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
        <Container className="mt-5">
            <h1 className="text-center">Liste des Candidatures</h1>
            <div className="mb-3">
                <Link to="/chefDeFiliere/listeOffres">Back to Offers</Link>
            </div>
            {candidatures.length > 0 ? (
                <ul className="list-unstyled">
                    {candidatures.map((candidature) => {
                        const student = candidature.Etudiant;
                        const studentDetail = studentDetails[student?.ID_Etudiant];

                        return (
                            <li key={candidature.ID_Candidature} className="candidature-item mb-4 p-3 border rounded bg-light">
                                <h2>Internship Offer: {candidature.Offre?.Titre_Offre || "No Title"}</h2>
                                <p>
                                    <strong>Response from Company:</strong> {candidature.Réponse_Entreprise || "Pending"}
                                </p>
                                {studentDetail ? (
                                    <div>
                                        <h3>Student Details</h3>
                                        <p><strong>Name:</strong> {studentDetail.Nom_Etudiant} {studentDetail.Prenom_Etudiant}</p>
                                        <p><strong>Email:</strong> {studentDetail.Email_Etudiant}</p>
                                        <p><strong>Phone:</strong> {studentDetail.Tel_Etudiant}</p>
                                        <p><strong>Date of Birth:</strong> {studentDetail.Date_Naissance_Etudiant}</p>
                                        <p><strong>Filière:</strong> {studentDetail.Filiere_Etudiant}</p>
                                        <p><strong>Year:</strong> {studentDetail.Annee_Etudiant}</p>
                                        <p>
                                            {studentDetail.CV_Etudiant ? (
                                                <Button
                                                    variant="primary"
                                                    onClick={() => handleDownloadCV(studentDetail.CV_Etudiant)}
                                                >
                                                    View CV
                                                </Button>
                                            ) : (
                                                "No CV available"
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <p>Loading student details...</p>
                                )}
                                {candidature.Réponse_CDF !== "accepted" && (
                                    <Button
                                        variant="success"
                                        className="mt-3"
                                        onClick={() => handleAcceptCandidature(candidature.ID_Candidature)}
                                    >
                                        Accept Candidature
                                    </Button>
                                )}
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <Alert variant="info">No candidatures found.</Alert>
            )}
        </Container>
    );
};

export default ListeCandidatures;
