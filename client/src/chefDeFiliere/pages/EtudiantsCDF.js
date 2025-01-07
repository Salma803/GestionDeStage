import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../Components/SideNav";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import UseAuth from "../hooks/UseAuth";

const EtudiantsCDF = () => {
  const isAuthenticated = UseAuth();

  const [cdfId, setCdfId] = useState(null); // Store the Chef Filière ID
  const [etudiants, setEtudiants] = useState([]); // Store the list of students
  const [error, setError] = useState(null); // Store errors
  const [loading, setLoading] = useState(true); // Loading state

  // Step 1: Fetch the Chef Filière ID
  useEffect(() => {
    const fetchChefFiliereId = async () => {
      try {
        const response = await axios.get("http://localhost:3001/chefdefiliere/me", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setCdfId(response.data.ID_CDF); // Save the Chef Filière ID
      } catch (error) {
        setError("Failed to fetch Chef Filière ID.");
        console.error("Error fetching Chef Filière ID:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChefFiliereId();
  }, []);

  // Step 2: Fetch students associated with the Chef Filière
  useEffect(() => {
    if (cdfId) {
      const fetchEtudiants = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3001/chefdefiliere/etudiants/${cdfId}`, {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          });
          setEtudiants(response.data); // Save the list of students
        } catch (error) {
          
        } finally {
          setLoading(false);
        }
      };

      fetchEtudiants();
    }
  }, [cdfId]);

  // Render the page
  return (
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main className="offers-main">
          <h1 style={{display:'flex',justifyContent:'center'}} className="offers-title">Liste des Étudiants</h1>

          {loading && <p>Loading...</p>}

          {error && <p className="error-message">{error}</p>}

          {etudiants.length > 0 && (
            <div className="offers-cards-container">
              {etudiants.map((etudiant) => (
                <div key={etudiant.ID_Etudiant} className="offer-card">
                  <h2 className="offer-title">{`${etudiant.Prenom_Etudiant} ${etudiant.Nom_Etudiant}`}</h2>
                  <p className="offer-description">
                    <strong>ID:</strong> {etudiant.ID_Etudiant}
                  </p>
                  <p className="offer-status">
                    <strong>Email:</strong> {etudiant.Email_Etudiant}
                  </p>
                  <p>
                    <strong>Phone:</strong> {etudiant.Tel_Etudiant}
                  </p>
                  <p>
                    <strong>Birth Date:</strong> {etudiant.Date_Naissance_Etudiant}
                  </p>
                  <p>
                    <strong>Filière:</strong> {etudiant.Filiere_Etudiant}
                  </p>
                  <p>
                    <strong>Trouvé stage:</strong>{" "}
                    {etudiant.Statut_Recherche === "true" ? "Oui" : "Non"}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && etudiants.length === 0 && <p 
  className="text-center" 
  style={{
    fontSize: '1.2rem',
    color: '#555',
    backgroundColor: '#f8f9fa',
    padding: '10px 20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
    textAlign: 'center',
  }}
>
  Pas d'etudiants trouvés pour cette filière.
</p>}
        </main>
        
      </div>
    </div>
  );
};

export default EtudiantsCDF;
