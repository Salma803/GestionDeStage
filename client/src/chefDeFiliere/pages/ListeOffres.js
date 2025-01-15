import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import UseAuth from "../hooks/UseAuth";
import Header from "../Components/Header";
import SideNav from "../Components/SideNav";
import "../css/ListeOffres.css";

const ListeOffres = () => {
  const isAuthenticated = UseAuth();
  const navigate = useNavigate();
  const [offres, setOffres] = useState([]);
  const [flags, setFlags] = useState({});
  const [comments, setComments] = useState({});
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [idCdf, setIdCdf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) {
          throw new Error("Access token is missing");
        }

        const response = await axios.get("http://localhost:3001/chefdefiliere/me", {
          headers: { accessToken: token },
        });

        if (!response.data || !response.data.ID_CDF) {
          throw new Error("Invalid user data received");
        }

        setIdCdf(response.data.ID_CDF);
        await fetchOffers();
      } catch (error) {
        setError("Failed to fetch user data");
        console.error("Error fetching user data:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    const fetchOffers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/entreprise/listeOffres");
        setOffres(response.data);
      } catch (error) {
        setOffres([]);
        console.error("Error fetching offers:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (offres.length > 0 && idCdf) {
      offres.forEach((offer) => fetchFlaggedOffers(offer.ID_Offre));
    }
  }, [offres, idCdf]);

  const fetchFlaggedOffers = async (id_offre) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/chefdefiliere/flag/${id_offre}/${idCdf}`
      );
      setFlags((prev) => ({ ...prev, [id_offre]: response.data }));
    } catch (error) {
      console.error("Error fetching flagged offers:", error);
    }
  };

  const handleFlagOffer = async (id_offre, status_flag) => {
    if (!idCdf) {
      alert("User ID not available.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3001/chefdefiliere/flaggerOffre/${id_offre}/${idCdf}`,
        { id_offre, id_cdf: idCdf, status_flag, comments: comments[id_offre] || "" },
        { headers: { accessToken: sessionStorage.getItem("accessToken") } }
      );

      // Update the specific flag in the state
      setFlags((prev) => ({
        ...prev,
        [id_offre]: response.data, // Assuming response.data contains the flag details
      }));

      setEditingOfferId(null); // Exit editing mode
      alert(`Offer ${status_flag} successfully!`);
      window.location.reload();

    } catch (error) {
      console.error("Error flagging offer:", error);
      alert("Failed to flag offer.");
    }
  };


  const handleCommentChange = (id_offre, value) => {
    setComments((prev) => ({ ...prev, [id_offre]: value }));
  };

  const toggleEditMode = (id_offre) => {
    setEditingOfferId((prev) => (prev === id_offre ? null : id_offre));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main className="offers-main">
          <h1 className="offers-title">Liste des Offres</h1>

          <div className="offers-cards-container">
            {offres.filter((offer) => offer.Status_Offre === "open").map((offer) => (
              <div key={offer.ID_Offre} className="offer-card">
                <h3 className="text-primary">{offer.Titre_Offre}</h3>
                <p>{offer.Description_Offre}</p>
                <p><strong>Durée:</strong> {offer.Durée}</p>
                <p><strong>Période:</strong> {offer.Période}</p>
                <h4>Informations sur l'entreprise</h4>
                <p><strong>Nom:</strong> {offer.Company.Nom_Entreprise}</p>
                <p><strong>Adresse:</strong> {offer.Company.Adresse_Entreprise}</p>
                <p><strong>Téléphone:</strong> {offer.Company.Tel_Entreprise}</p>
                <p><strong>Email:</strong> {offer.Company.Email_Entreprise}</p>

                {flags[offer.ID_Offre] && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      margin: "10px 0",
                      backgroundColor:
                        flags[offer.ID_Offre].Status_Flag === "approved"
                          ? "#d4edda" // Light green for approved
                          : flags[offer.ID_Offre].Status_Flag === "rejected"
                          ? "#f8d7da" // Light red for rejected
                          : "#fff", // Default background color
                      color:
                        flags[offer.ID_Offre].Status_Flag === "approved"
                          ? "#155724" // Dark green text for approved
                          : flags[offer.ID_Offre].Status_Flag === "rejected"
                          ? "#721c24" // Dark red text for rejected
                          : "#000", // Default text color
                      border: `1px solid ${flags[offer.ID_Offre].Status_Flag === "approved"
                        ? "#c3e6cb" // Green border for approved
                        : flags[offer.ID_Offre].Status_Flag === "rejected"
                        ? "#f5c6cb" // Red border for rejected
                        : "#ccc" // Default border color
                        }`,
                    }}
                  >
                    <p>
                      <strong>Décision du flag:</strong>{" "}
                      {flags[offer.ID_Offre].Status_Flag === "approved"  ? "Recommandé" : flags[offer.ID_Offre].Status_Flag === "rejected" ? "Rejeté" : "En attente"}
                    </p>
                    <p>
                      <strong>Commentaire:</strong>{" "}
                      {flags[offer.ID_Offre].Comments
                        ? flags[offer.ID_Offre].Comments
                        : "Pas de commentaire"}
                    </p>
                  </div>
                )}

                {editingOfferId === offer.ID_Offre ? (
                  <div>
                    <textarea
                      placeholder="Add a comment (optional)"
                      value={comments[offer.ID_Offre] || ""}
                      onChange={(e) => handleCommentChange(offer.ID_Offre, e.target.value)}
                    ></textarea>
                    <button className="btn btn-success btn-sm" onClick={() => handleFlagOffer(offer.ID_Offre, "approved")}>
                      Appouver
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleFlagOffer(offer.ID_Offre, "rejected")}>
                      Rejeter
                    </button>
                    <button className="btn btn-warning btn-sm" onClick={() => toggleEditMode(null)}>Retour</button>
                  </div>
                ) : (
                  <button
                    style={{
                      padding: "10px 15px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                      backgroundColor: "#e7f1ff", // Light blue for unflagged offers
                      color: '#004085',
                      border: '1px solid #cce5ff',
                      cursor: "pointer",
                    }}
                    onClick={() => toggleEditMode(offer.ID_Offre)}
                  >
                    {flags[offer.ID_Offre]?.Status_Flag === "approved"
                      ? "Changer Recommandation"
                      : flags[offer.ID_Offre]?.Status_Flag === "rejected"
                        ? "Changer Rejet"
                        : "Flagger cette offre"}
                  </button>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListeOffres;
