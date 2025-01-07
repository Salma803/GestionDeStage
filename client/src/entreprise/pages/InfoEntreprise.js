import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import Footer from "../components/Footer";

const InfoEntreprise = () => {
  const [cdfId, setCdfId] = useState(null); // Store the Entreprise ID
  const [Entreprise, setEntreprise] = useState(null); // Store Entreprise details
  const [error, setError] = useState(null); // Store errors
  const [loading, setLoading] = useState(true); // Loading state

  // Step 1: Fetch the user data and retrieve the ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/entreprise/me", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setCdfId(response.data.ID_Entreprise); // Save the retrieved ID
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Step 2: Fetch Entreprise details once the ID is available
  useEffect(() => {
    if (cdfId) {
      const fetchEntrepriseInfo = async () => {
        setLoading(true); // Set loading state
        try {
          const response = await axios.get(`http://localhost:3001/entreprise/find/${cdfId}`, {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          });
          setEntreprise(response.data); // Save Entreprise details
        } catch (err) {
          setError("Failed to fetch Entreprise details.");
          console.error("Error fetching Entreprise:", err);
        } finally {
          setLoading(false); // End loading state
        }
      };

      fetchEntrepriseInfo();
    }
  }, [cdfId]);

  // Render the page
  return (
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main className="offers-main">
          <h1 className="offers-title">Entreprise Information</h1>

          {loading && <p>Loading...</p>}

          {error && <p className="error-message">{error}</p>}

          {Entreprise && (
            <div className="offer-card">
              <h2 className="offer-title">
                { Entreprise.Nom_Entreprise || "No Name Available"}
              </h2>
              <p>
                <strong>ID:</strong> {Entreprise.ID_Entreprise || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {Entreprise.Email_Entreprise || "N/A"}
              </p>
              
              <p>
                <strong>Adresse:</strong> {Entreprise.Adresse_Entreprise || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {Entreprise.Tel_Entreprise || "N/A"}
              </p>
              <p>
                <strong>Password:</strong> {Entreprise.MotDePasse_Entreprise || "N/A"}
              </p>
            </div>
          )}

          {!loading && !error && !Entreprise && <p>No data found.</p>}
        </main>
      </div>
    </div>
  );
};

export default InfoEntreprise;
