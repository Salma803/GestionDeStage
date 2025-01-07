import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../Components/SideNav";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import UseAuth from "../hooks/UseAuth";


const InfoCDF = () => {
  const isAuthenticated = UseAuth();

  const [cdfId, setCdfId] = useState(null); // Store the Chef Filière ID
  const [chefFiliere, setChefFiliere] = useState(null); // Store Chef Filière details
  const [error, setError] = useState(null); // Store errors
  const [loading, setLoading] = useState(true); // Loading state

  // Step 1: Fetch the user data and retrieve the ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/chefdefiliere/me", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setCdfId(response.data.ID_CDF); // Save the retrieved ID
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Step 2: Fetch Chef Filière details once the ID is available
  useEffect(() => {
    if (cdfId) {
      const fetchChefFiliereInfo = async () => {
        setLoading(true); // Set loading state
        try {
          const response = await axios.get(`http://localhost:3001/chefdefiliere/find/${cdfId}`, {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          });
          setChefFiliere(response.data); // Save Chef Filière details
        } catch (err) {
          setError("Failed to fetch Chef Filière details.");
          console.error("Error fetching Chef Filière:", err);
        } finally {
          setLoading(false); // End loading state
        }
      };

      fetchChefFiliereInfo();
    }
  }, [cdfId]);

  // Render the page
  return (
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main className="offers-main">
          <h1 className="offers-title">Chef Filière Information</h1>

          {loading && <p>Loading...</p>}

          {error && <p className="error-message">{error}</p>}

          {chefFiliere && (
            <div className="offer-card">
              <h2 className="offer-title">
                {chefFiliere.Nom_CDF || "No Name Available"}
              </h2>
              <p>
                <strong>ID:</strong> {chefFiliere.ID_CDF || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {chefFiliere.Email_CDF || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {chefFiliere.Tel_CDF || "N/A"}
              </p>
              <p>
                <strong>Department:</strong> {chefFiliere.FiliereAssociee_CDF || "N/A"}
              </p>
              <p>
                <strong>Password:</strong> {chefFiliere.MotDePasse_CDF || "N/A"}
              </p>
            </div>
          )}

          {!loading && !error && !chefFiliere && <p>No data found.</p>}
        </main>
        
      </div>
    </div>
  );
};

export default InfoCDF;
