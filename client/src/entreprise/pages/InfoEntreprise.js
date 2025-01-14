import React, { useState, useEffect } from "react";
import axios from "axios";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import Footer from "../components/Footer";
import UseAuth from "../hooks/UseAuth";

const InfoEntreprise = () => {
  const isAuthenticated = UseAuth();

  const [cdfId, setCdfId] = useState(null); // Stocker l'ID de l'Entreprise
  const [Entreprise, setEntreprise] = useState(null); // Stocker les détails de l'Entreprise
  const [error, setError] = useState(null); // Stocker les erreurs
  const [loading, setLoading] = useState(true); // État de chargement

  // État pour le changement de mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false); // Basculer la visibilité du formulaire de mot de passe

  // Étape 1 : Récupérer les données de l'utilisateur et l'ID
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/entreprise/me", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setCdfId(response.data.ID_Entreprise); // Enregistrer l'ID récupéré
      } catch (error) {
        setError("Échec de la récupération des données utilisateur.");
        console.error("Erreur lors de la récupération des données utilisateur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Étape 2 : Récupérer les détails de l'Entreprise une fois l'ID disponible
  useEffect(() => {
    if (cdfId) {
      const fetchEntrepriseInfo = async () => {
        setLoading(true); // Définir l'état de chargement
        try {
          const response = await axios.get(`http://localhost:3001/entreprise/find/${cdfId}`, {
            headers: {
              accessToken: sessionStorage.getItem("accessToken"),
            },
          });
          setEntreprise(response.data); // Enregistrer les détails de l'Entreprise
        } catch (err) {
          setError("Échec de la récupération des détails de l'Entreprise.");
          console.error("Erreur lors de la récupération de l'Entreprise :", err);
        } finally {
          setLoading(false); // Fin de l'état de chargement
        }
      };

      fetchEntrepriseInfo();
    }
  }, [cdfId]);

  // Gérer le changement de mot de passe
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
      setShowPasswordForm(false); // Masquer le formulaire de mot de passe après succès
    } catch (error) {
      alert("Le mot de passe entré ne correspond pas au mot de passe actuel.");
      console.error("Erreur lors de la mise à jour du mot de passe :", error);
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
            style={{ minHeight: "1500px", margin: "0 auto" }}
          >
            {loading && <p className="text-center text-muted">Chargement...</p>}
            {error && <p className="text-center text-danger">{error}</p>}
            {!loading && !error && !Entreprise && (
              <p className="text-center text-warning">Aucune donnée trouvée.</p>
            )}

            {Entreprise && (
              <div style={{ marginLeft: "200px" }} className="offer-card">
                <h2 className="offer-title mt-4">
                  {Entreprise.Nom_Entreprise || "Nom non disponible"}
                </h2>
                <p>
                  <strong>Email :</strong> {Entreprise.Email_Entreprise}
                </p>
                <p>
                  <strong>Téléphone :</strong> {Entreprise.Tel_Entreprise}
                </p>
                <p>
                  <strong>Adresse :</strong> {Entreprise.Adresse_Entreprise}
                </p>

                {!showPasswordForm && (
                  <button
                    className="btn btn-primary mt-3"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    Changer le mot de passe
                  </button>
                )}

                {showPasswordForm && (
                  <div className="mt-4">
                    <strong style={{color:'InfoText'}}>Changer votre mot de passe</strong>
                    <form onSubmit={handlePasswordChange}>
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
                        <label>Confirmer le nouveau MDP</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                      {passwordError && <p className="error-message">{passwordError}</p>}
                      {successMessage && <p className="success-message">{successMessage}</p>}
                      <button className="btn btn-success" type="submit">Changer MDP</button>
                      <button
                        type="button"
                        className="btn btn-secondary "
                        onClick={() => setShowPasswordForm(false)}
                      >
                        Annuler
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default InfoEntreprise;
