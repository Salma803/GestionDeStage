import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import UseAuth from "../hooks/UseAuth";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SideNav from "../Components/SideNav";
import '../css/ListeOffres.css';

const ListeOffres = () => {
  const isAuthenticated = UseAuth();
    const navigate = useNavigate();
  const [offres, setOffres] = useState([]);
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
        if (error.response && error.response.status === 401) {
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
        console.error("Error fetching offers:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleFlagOffer = async (id_offre, status_flag) => {
    const comment = comments[id_offre] || "";

    if (!idCdf) {
      alert("User ID not available.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3001/chefdefiliere/flaggerOffre/${id_offre}/${idCdf}`,
        {
          id_offre,
          id_cdf: idCdf, // Include id_cdf in the request
          status_flag,
          comments: comment,
        },
        {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }
      );

      setOffres((prev) =>
        prev.map((offer) =>
          offer.ID_Offre === id_offre
            ? { ...offer, Status_Offre: status_flag }
            : offer
        )
      );
      setEditingOfferId(null);
      alert(`Offer ${status_flag} successfully!`);
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
          <div>
                <Link to="/chefdefiliere/offresapprouvees">Offres approuvées</Link>
                </div>
                <div>
                  <Link to="/chefdefiliere/offresrejetees">Offres rejetées</Link>
                </div>
                <div>
                  <Link to="/chefdefiliere/candidatures">Voir les Candidatures</Link>
                </div>
          
          <h1 className="offers-title">Liste des Offres</h1>
          <div className="offers-cards-container">
            {offres.map((offer) => (
              <div key={offer.ID_Offre} className="offer-card">
                <h2 className="offer-title">{offer.Titre_Offre || "No Title"}</h2>
                <p className="offer-description">
                  <strong>Description du stage:</strong>{" "}
                  {offer.Description_Offre || "No description available"}
                </p>
                <p className="offer-description">
                  <strong>Durée du stage:</strong>{" "}
                  {offer.Durée || "No Duree available"}
                </p>
                <p className="offer-description">
                  <strong>Mots-clés du stage:</strong>{" "}
                  {offer.Période || "No period available"}
                </p>
                <p className="offer-description">
                  <strong>Mots-clés du stage:</strong>{" "}
                  {offer.Keywords_Offre || "No Keywords available"}
                </p>

                <p className="offer-status">
                  <strong>Status:</strong> {offer.Status_Offre || "Pending"}
                </p>
                <div className="company-info">
                  {offer.Company ? (
                    <>
                      <p>
                        <strong>Entreprise:</strong> {offer.Company.Nom_Entreprise}
                      </p>
                      <p>
                        <strong>Email:</strong> {offer.Company.Email_Entreprise}
                      </p>
                      <p>
                        <strong>Tel:</strong> {offer.Company.Tel_Entreprise}
                      </p>
                      <p>
                        <strong>Adresse:</strong> {offer.Company.Adresse_Entreprise}
                      </p>
                    </>
                  ) : (
                    <p>No company information available</p>
                  )}
                </div>
                {editingOfferId === offer.ID_Offre ? (
                  <div className="offer-edit-section">
                    <textarea
                      placeholder="Add a comment (optional)"
                      value={comments[offer.ID_Offre] || ""}
                      onChange={(e) => handleCommentChange(offer.ID_Offre, e.target.value)}
                      className="comment-textarea"
                    ></textarea>
                    <div className="offer-action-buttons">
                      <button
                        className="offer-approve-button"
                        onClick={() => handleFlagOffer(offer.ID_Offre, "approved")}
                      >
                        Aprouver
                      </button>
                      <button
                        className="offer-reject-button"
                        onClick={() => handleFlagOffer(offer.ID_Offre, "rejected")}
                      >
                        Rejeter
                      </button>
                      <button
                        className="offer-cancel-button"
                        onClick={() => setEditingOfferId(null)}
                      >
                        Retour
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="offer-edit-button"
                    onClick={() => toggleEditMode(offer.ID_Offre)}
                  >
                    {offer.Status_Offre === "approved"
                      ? "Change Approval"
                      : offer.Status_Offre === "rejected"
                      ? "Change Rejection"
                      : "Changer Statut"}
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
