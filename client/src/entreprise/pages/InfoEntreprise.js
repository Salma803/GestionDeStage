import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UseAuth from "../hooks/UseAuth";

const InfoEntreprise = () => {
  const isAuthenticated = UseAuth();

  const [cdfId, setCdfId] = useState(null); // Store the Entreprise ID
  const [Entreprise, setEntreprise] = useState(null); // Store Entreprise details
  const [error, setError] = useState(null); // Store errors
  const [loading, setLoading] = useState(true); // Loading state

  // State for password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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

  // Handle password change
  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return;
    }

    setPasswordError("");

    try {
      await axios.put(
        `http://localhost:3001/entreprise/update/${cdfId}`,
        { currentPassword, newPassword },
        {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }
      );

      alert("Mot de passe mis à jour avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      alert("Erreur lors de la mise à jour du mot de passe.");
      console.error("Error updating password:", error);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div className="liste-offres-page d-flex">
      <SideNav />
      <div className="content-area w-100">
        <Header />
        <main className="offers-main">
          <div
            className="container my-5"
            style={{ minHeight: "1500px", maxWidth: "800px", margin: "0 auto" }}
          >
            {loading && <p className="text-center text-muted">Loading...</p>}
            {error && <p className="text-center text-danger">{error}</p>}
            {!loading && !error && !Entreprise && (
              <p className="text-center text-warning">No data found.</p>
            )}

            {Entreprise && (
              <div style={{ marginLeft: "200px" }} className="offer-card">
                <h2 className="offer-title mt-4">
                  {Entreprise.Nom_Entreprise || "No Name Available"}
                </h2>
                <p>
                  <strong>Email:</strong> {Entreprise.Email_Entreprise}
                </p>
                <p>
                  <strong>Téléphone:</strong> {Entreprise.Tel_Entreprise}
                </p>
                <p>
                  <strong>Adresse:</strong> {Entreprise.Adresse_Entreprise}
                </p>

                <h2>Change Your Password</h2>
                <form onSubmit={handlePasswordChange}>
                  <div>
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {passwordError && <p className="error-message">{passwordError}</p>}
                  {successMessage && <p className="success-message">{successMessage}</p>}
                  <button type="submit">Update Password</button>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InfoEntreprise;
