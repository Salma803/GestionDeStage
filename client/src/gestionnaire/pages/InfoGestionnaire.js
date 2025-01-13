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
  const [formData, setFormData] = useState({
    Prenom_Gestionnaire: '',
    Nom_Gestionnaire: '',
    Email_Gestionnaire: '',
    Tel_Gestionnaire: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '', // New field for confirm password
  });

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
          setFormData({
            Prenom_Gestionnaire: response.data.Prenom_Gestionnaire,
            Nom_Gestionnaire: response.data.Nom_Gestionnaire,
            Email_Gestionnaire: response.data.Email_Gestionnaire,
            Tel_Gestionnaire: response.data.Tel_Gestionnaire,
            currentPassword: '',
            newPassword: '',
            confirmPassword: '', // Initialize the confirm password
          });
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

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { Prenom_Gestionnaire, Nom_Gestionnaire, Email_Gestionnaire, Tel_Gestionnaire, currentPassword, newPassword, confirmPassword } = formData;

    // Step 3: Validate that newPassword and confirmPassword match
    if (newPassword !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas.");
      setFormData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '' // Clear the confirm password field on error
      }));
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:3001/gestionnaire/update/${cdfId}`, {
        currentPassword,
        newPassword,
        Prenom_Gestionnaire,
        Nom_Gestionnaire,
        Email_Gestionnaire,
        Tel_Gestionnaire,
      }, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      });

      alert("Vos informations ont été mis à jour avec succès.");
      setFormData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '' // Clear the confirm password field on error
      }));

    } catch (error) {
      alert("Erreur lors de la mise à jour du mot de passe.");
      console.error("Error updating information or password:", error);
      // Clear password fields on error
      setFormData(prevState => ({
        ...prevState,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '' // Clear the confirm password field on error
      }));
    } finally {
      setLoading(false);
    }
  };

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
        }} className="offers-main">

          {loading && <p>Loading...</p>}

          {error && <p className="error-message">{error}</p>}

          {Gestionnaire && (
            <div className="offer-card">
              <h1 className="offers-title">Vos Informations</h1>

              <form onSubmit={handleSubmit}>
                <div>
                  <label>Prénom:</label>
                  <input
                    type="text"
                    name="Prenom_Gestionnaire"
                    value={formData.Prenom_Gestionnaire}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Nom: </label>
                  <input
                    type="text"
                    name="Nom_Gestionnaire"
                    value={formData.Nom_Gestionnaire}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Email:</label>
                  <input
                    type="email"
                    name="Email_Gestionnaire"
                    value={formData.Email_Gestionnaire}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Téléphone:</label>
                  <input
                    type="text"
                    name="Tel_Gestionnaire"
                    value={formData.Tel_Gestionnaire}
                    onChange={handleChange}
                  />
                </div>

                <h2>Changer de mot de passe</h2>
                <div>
                  <label>Mot de passe actuel:</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Nouveau mot de passe:</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label>Confirmer le mot de passe:</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <button type="submit">Mettre à jour</button>
                </div>
              </form>
            </div>
          )}

          {!loading && !error && !Gestionnaire && <p>No data found.</p>}
        </main>
      </div>
    </div>
  );
};

export default InfoGestionnaire;
