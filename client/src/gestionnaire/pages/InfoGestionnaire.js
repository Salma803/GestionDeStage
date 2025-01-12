import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UseAuth from "../hooks/UseAuth";

const InfoGestionnaire = () => {
  const isAuthenticated = UseAuth();
  const [cdfId, setCdfId] = useState(null); // Store the Gestionnaire ID
  const [Gestionnaire, setGestionnaire] = useState(null); // Store Gestionnaire details
  const [error, setError] = useState(null); // Store errors
  const [loading, setLoading] = useState(true); // Loading state

  // Step 1: Fetch the user data and retrieve the ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/gestionnaire/me", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setCdfId(response.data.ID_Gestionnaire); // Save the retrieved ID
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Step 2: Fetch Gestionnaire details once the ID is available
  useEffect(() => {
    if (cdfId) {
      const fetchGestionnaireInfo = async () => {
        setLoading(true); // Set loading state
        try {
          const response = await axios.get(`http://localhost:3001/gestionnaire/find/${cdfId}`, {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          });
          setGestionnaire(response.data); // Save Gestionnaire details
        } catch (err) {
          setError("Failed to fetch Gestionnaire details.");
          console.error("Error fetching Gestionnaire:", err);
        } finally {
          setLoading(false); // End loading state
        }
      };

      fetchGestionnaireInfo();
    }
  }, [cdfId]);

  // Render the page
  return (
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main style={{
    display: 'flex',
    justifyContent: 'center',
    marginTop: '120px',
    backgroundColor: '#fff',
    padding: '20px',
     // Red border to match the theme
  }}  className="offers-main">
          

          {loading && <p>Loading...</p>}

          {error && <p className="error-message">{error}</p>}

          {Gestionnaire && (
            <div className="offer-card">
              <h1 className="offers-title">Vos Informations</h1>
              <h2 className="offer-title">
                {Gestionnaire.Prenom_Gestionnaire +' ' + Gestionnaire.Nom_Gestionnaire || "No Name Available"}
              </h2>
              
              <p>
                <strong>Email:</strong> {Gestionnaire.Email_Gestionnaire || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {Gestionnaire.Tel_Gestionnaire || "N/A"}
              </p>
              <p>
                <strong>Password:</strong> {Gestionnaire.MotDePasse_Gestionnaire || "N/A"}
              </p>
            </div>
          )}

          {!loading && !error && !Gestionnaire && <p>No data found.</p>}
        </main>
      </div>
    </div>
  );
};

export default InfoGestionnaire;
