import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../Components/SideNav";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import UseAuth from "../hooks/UseAuth";

const InfoCDF = () => {
  const isAuthenticated = UseAuth();

  const [cdfId, setCdfId] = useState(null);
  const [chefFiliere, setChefFiliere] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/chefdefiliere/me", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setCdfId(response.data.ID_CDF);
      } catch (error) {
        setError("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch Chef Filière details
  useEffect(() => {
    if (cdfId) {
      const fetchChefFiliereInfo = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:3001/chefdefiliere/find/${cdfId}`, {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          });
          setChefFiliere(response.data);
        } catch (err) {
          setError("Failed to fetch Chef Filière details.");
          console.error("Error fetching Chef Filière:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchChefFiliereInfo();
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

    try {
      await axios.put(
        `http://localhost:3001/chefdefiliere/update/${cdfId}`,
        { currentPassword, newPassword },
        { headers: { accessToken: sessionStorage.getItem("accessToken") } }
      );
      alert("Mot de passe mis à jour avec succès");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordForm(false); // Hide the form after successful update
    } catch (error) {
      alert("Mot de passe entré différent du mot de passe actuel.");
      console.error("Error updating password:", error);
    }
  };

  return (
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "120px",
            backgroundColor: "#fff",
            padding: "20px",
          }}
          className="offers-main"
        >
          {loading && <p>Loading...</p>}

          {error && <p className="error-message">{error}</p>}

          {chefFiliere && (
            <div className="offer-card">
              <h1 className="offers-title">Vos Informations</h1>
              <h2 className="offer-title">{chefFiliere.Nom_CDF || "No Name Available"}</h2>
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

              <button
                className="btn btn-primary"
                onClick={() => setShowPasswordForm((prev) => !prev)}
              >
                {showPasswordForm ? "Annuler" : "Changer mot de passe"}
              </button>

              {showPasswordForm && (
                <form
                  onSubmit={handlePasswordChange}
                  style={{ marginTop: "20px", borderTop: "1px solid #ddd", paddingTop: "20px" }}
                >
                  <div>
                    <label>MDP actuel</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>Nouveau MDP</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label>Confirmer nouveau MDP</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  {passwordError && <p className="error-message">{passwordError}</p>}
                  {successMessage && <p className="success-message">{successMessage}</p>}
                  <button className="btn btn-success" type="submit">
                    Changer MDP
                  </button>
                </form>
              )}
            </div>
          )}

          {!loading && !error && !chefFiliere && <p>No data found.</p>}
        </main>
      </div>
    </div>
  );
};

export default InfoCDF;
