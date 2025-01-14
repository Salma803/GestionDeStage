import React, { useEffect, useState } from "react"; 
import axios from "axios";
import { Container, Spinner, Alert, Table, Button, Form } from "react-bootstrap";
import UseAuth from "../hooks/UseAuth";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import "../css/ListeOffres.css";
import SideNav from "../Components/SideNav";

const ListeCandidatures = () => {
  const isAuthenticated = UseAuth();
  const [candidatures, setCandidatures] = useState([]);
  const [filteredCandidatures, setFilteredCandidatures] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
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
          setFilteredCandidatures(response.data); // Initialize filtered candidatures
          setLoading(false);
        })
        .catch((error) => {
          setError("Failed to fetch candidatures.");
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

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterCandidatures(query, filter);
  };

  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilter(selectedFilter);
    filterCandidatures(searchQuery, selectedFilter);
  };

  const filterCandidatures = (query, selectedFilter) => {
    let filtered = [...candidatures];

    // Apply filter by accepted candidatures
    if (selectedFilter === "accepted") {
      filtered = filtered.filter(
        (candidature) => candidature.Réponse_CDF === "accepted"
      );
    }
    if (selectedFilter === "rejected") {
      filtered = filtered.filter(
        (candidature) => candidature.Réponse_CDF !== "accepted"
      );
    }

    // Apply search query
    if (query) {
      filtered = filtered.filter((candidature) => {
        const studentName = `${candidature.Etudiant?.Nom_Etudiant || ""} ${candidature.Etudiant?.Prenom_Etudiant || ""}`.toLowerCase();
        const offerTitle = candidature.Offre?.Titre_Offre?.toLowerCase() || "";
        const studentId = candidature.Etudiant?.ID_Etudiant?.toString() || "";
        return (
          studentName.includes(query) ||
          offerTitle.includes(query) ||
          studentId.includes(query)
        );
      });
    }

    setFilteredCandidatures(filtered);
  };

  const handleDownloadCV = (cvFilename) => {
    const fileUrl = `http://localhost:3001/uploads/cvs/${cvFilename}`;
    window.open(fileUrl, "_blank");
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
        filterCandidatures(searchQuery, filter); // Update the filtered list after acceptance
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
          <div className="filters-container">
            <Form.Group controlId="searchQuery" className="mb-3">
              <Form.Label>Rechercher par ID, Nom ou Offre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </Form.Group>

            <Form.Group controlId="filter" className="mb-3">
              <Form.Label>Filtrer les candidatures</Form.Label>
              <Form.Select value={filter} onChange={handleFilterChange}>
                <option value="all">Toutes les candidatures</option>
                <option value="accepted">Candidatures acceptées</option>
                <option value="rejected">Candidatures en attente</option>

              </Form.Select>
            </Form.Group>
          </div>

          <h1 className="offers-title">Liste des Candidatures</h1>
          <div className="offers-cards-container">
            {filteredCandidatures.length > 0 ? (
              filteredCandidatures.map((candidature) => {
                const student = candidature.Etudiant;
                const studentDetail = studentDetails[student?.ID_Etudiant];

                return (
                  <div key={candidature.ID_Candidature} className="offer-card">
                    <h2 className="offer-title">
                      Offre de Stage:{" "}
                      {candidature.Offre?.Titre_Offre || "Pas de Titre"}
                    </h2>
                    <p>{candidature.Offre.Description_Offre}</p>
                    <p>
                      <strong>Durée:</strong> {candidature.Offre.Durée}
                    </p>
                    <p>
                      <strong>Période:</strong> {candidature.Offre.Période}
                    </p>
                    <h4>Informations sur l'entreprise</h4>
                    <p>
                      <strong>Nom:</strong> {candidature.Offre.Company.Nom_Entreprise}
                    </p>
                    <p>
                      <strong>Adresse:</strong>{" "}
                      {candidature.Offre.Company.Adresse_Entreprise}
                    </p>
                    <p>
                      <strong>Téléphone:</strong>{" "}
                      {candidature.Offre.Company.Tel_Entreprise}
                    </p>
                    <p>
                      <strong>Email:</strong>{" "}
                      {candidature.Offre.Company.Email_Entreprise}
                    </p>

                    {studentDetail ? (
                      <div className="company-info">
                        <h3 className="offers-title">Détails de l'Étudiant</h3>
                        <p>
                          <strong>Nom:</strong> {studentDetail.Nom_Etudiant}{" "}
                          {studentDetail.Prenom_Etudiant}
                        </p>
                        <p>
                          <strong>Email:</strong> {studentDetail.Email_Etudiant}
                        </p>
                        <p>
                          <strong>Téléphone:</strong> {studentDetail.Tel_Etudiant}
                        </p>
                        <p>
                          <strong>Date de Naissance:</strong>{" "}
                          {studentDetail.Date_Naissance_Etudiant}
                        </p>
                        <p>
                        <strong>Adresse:</strong> {studentDetail.Adresse_Etudiant}
                        </p>
                        <p>
                          <strong>Filière:</strong>{" "}
                          {studentDetail.Filiere_Etudiant}
                        </p>
                        <p>
                          <strong>Année:</strong> {studentDetail.Annee_Etudiant}
                        </p>
                        <p>
                          {studentDetail.CV_Etudiant ? (
                            <button
                              className="btn btn-info"
                              onClick={() =>
                                handleDownloadCV(studentDetail.CV_Etudiant)
                              }
                            >
                              Voir CV
                            </button>
                          ) : (
                            "Pas de CV disponible"
                          )}
                        </p>
                      </div>
                    ) : (
                      <p>Chargement des détails de l'étudiant...</p>
                    )}

{candidature.Réponse_CDF !== "accepted" && (
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          handleAcceptCandidature(candidature.ID_Candidature)
                        }
                      >
                        Accepter la Candidature
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <p
                className="text-center"
                style={{
                  fontSize: "1.2rem",
                  color: "#555",
                  backgroundColor: "#f8f9fa",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                  marginTop: "20px",
                  textAlign: "center",
                }}
              >
                Pas de Candidatures trouvées.
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default ListeCandidatures;