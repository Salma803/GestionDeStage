import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';

const ListeOffres = () => {
  const [offres, setOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [editingOfferId, setEditingOfferId] = useState(null); // Track which offer is being edited

  useEffect(() => {
    // Fetch the list of offers from the backend
    axios
      .get("http://localhost:3001/entreprise/listeOffres")
      .then((response) => {
        setOffres(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError("There was an error fetching the offers!");
        setLoading(false);
      });
  }, []);

  const handleFlagOffer = async (id_offre, status_flag) => {
    const id_cdf = "GL"; // Replace with the actual ChefFiliere ID
    const comment = comments[id_offre] || "";

    try {
      await axios.post("http://localhost:3001/chefdefiliere/flaggerOffre/GL", {
        id_cdf,
        id_offre,
        status_flag,
        comments: comment,
      });

      setOffres((prev) =>
        prev.map((offer) =>
          offer.ID_Offre === id_offre
            ? { ...offer, Status_Offre: status_flag }
            : offer
        )
      );

      alert(`Offer ${status_flag} successfully!`);
      setEditingOfferId(null); // Exit editing mode
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

  if (loading) {
    return <p>Loading offers...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="offers-container">
        <div><Link to="/chefdefiliere/offresapprouvees">Offres approves</Link></div>        
        <div><Link to="/chefdefiliere/offresrejetees">Offres rejetes</Link></div>

      <h1>Liste des Offres</h1>
      <ul className="offers-list">
        {offres.map((offer) => (
          <li key={offer.ID_Offre} className="offer-item">
            <h2>{offer.Titre_Offre || "No Title"}</h2>
            <p>
              <strong>Description:</strong> {offer.Description_Offre || "No description available"}
            </p>
            <p>
              <strong>Status:</strong> {offer.Status_Offre || "Pending"}
            </p>
            <div className="company-info">
              {offer.Company ? (
                <>
                  <p>
                    <strong>Company:</strong> {offer.Company.Nom_Entreprise}
                  </p>
                  <p>
                    <strong>Email:</strong> {offer.Company.Email_Entreprise}
                  </p>
                  <p>
                    <strong>Phone:</strong> {offer.Company.Tel_Entreprise}
                  </p>
                  <p>
                    <strong>Address:</strong> {offer.Company.Adresse_Entreprise}
                  </p>
                </>
              ) : (
                <p>No company information available</p>
              )}
            </div>
            {editingOfferId === offer.ID_Offre && (
              <>
                <textarea
                  placeholder="Add a comment (optional)"
                  value={comments[offer.ID_Offre] || ""}
                  onChange={(e) => handleCommentChange(offer.ID_Offre, e.target.value)}
                ></textarea>
                <button onClick={() => handleFlagOffer(offer.ID_Offre, "approved")}>
                  Confirm Approve
                </button>
                <button onClick={() => handleFlagOffer(offer.ID_Offre, "rejected")}>
                  Confirm Reject
                </button>
                <button onClick={() => setEditingOfferId(null)}>Cancel</button>
              </>
            )}
            {editingOfferId !== offer.ID_Offre && (
              <button onClick={() => toggleEditMode(offer.ID_Offre)}>
                {offer.Status_Offre === "approved"
                  ? "Change Approval"
                  : offer.Status_Offre === "rejected"
                  ? "Change Rejection"
                  : "Approve/Reject"}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ListeOffres;
