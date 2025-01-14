import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import UseAuth from "../hooks/UseAuth";

const CompanyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatut, setSearchStatut] = useState(""); // State for statut search
  const [searchTitre, setSearchTitre] = useState(""); // State for titre search
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isAuthenticated = UseAuth();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/entreprise/me", {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });

        const companyId = response.data.ID_Entreprise;

        const offersResponse = await axios.get(
          `http://localhost:3001/entreprise/offresParEntreprise/${companyId}`
        );
        setOffers(offersResponse.data);
      } catch (error) {
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Function to close an offer
  const closeOffer = async (offerId) => {
    try {
      await axios.put(
        `http://localhost:3001/entreprise/fermerOffre/${offerId}`,
        {},
        {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        }
      );
      // Update the offer status locally after successful closure
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.ID_Offre === offerId ? { ...offer, Status_Offre: "closed" } : offer
        )
      );
    } catch (error) {
      setError("Erreur lors de la fermeture de l'offre.");
    }
  };

  // Filter and sort offers by multiple criteria
  const filteredAndSortedOffers = offers
    .filter((offer) =>
      offer.ID_Offre.toString().includes(searchTerm) && // Search by ID
      offer.Titre_Offre.toLowerCase().includes(searchTitre.toLowerCase()) && // Search by Titre
      (offer.Status_Offre.toLowerCase().includes(searchStatut.toLowerCase()) || searchStatut === "") // Search by Statut
    )
    .sort((a, b) => a.ID_Offre - b.ID_Offre); // Sort by ID

  return (
    <div className="d-flex">
      {/* Barre latérale */}
      <SideNav />

      <div className="main-content w-100">
        {/* En-tête */}
        <Header />

        {/* Contenu */}
        <div className="container mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Offres de l'entreprise</h2>

              {/* Champ de recherche */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Search by Statut */}
              <div className="mb-3">
                <select
                  className="form-control"
                  value={searchStatut}
                  onChange={(e) => setSearchStatut(e.target.value)}
                >
                  <option value="">Rechercher par Statut</option>
                  <option value="open">Ouvert</option>
                  <option value="closed">Fermé</option>
                </select>
              </div>


              {/* Search by Titre */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Rechercher par Titre"
                  value={searchTitre}
                  onChange={(e) => setSearchTitre(e.target.value)}
                />
              </div>

              {/* Tableau */}
              {loading ? (
                <div className="text-center">
                  <p>Chargement...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger text-center">
                  {error}
                </div>
              ) : offers.length > 0 ? (
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Titre</th>
                      <th>Description</th>
                      <th>Statut</th>
                      <th>Durée</th>
                      <th>Période</th>
                      <th>Tuteur</th>
                      <th>Mots-clés</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedOffers.map((offer) => (
                      <tr key={offer.ID_Offre}>
                        <td>{offer.ID_Offre}</td>
                        <td>{offer.Titre_Offre || "N/A"}</td>
                        <td>{offer.Description_Offre || "N/A"}</td>
                        <td>{offer.Status_Offre === "open" ? "Ouvert" : offer.Status_Offre === "closed" ? "Fermé" : "N/A"}</td>
                        <td>{offer.Durée || "N/A"}</td>
                        <td>{offer.Période || "N/A"}</td>
                        <td>{offer.Tuteur || "N/A"}</td>
                        <td>{offer.Keywords_Offre || "N/A"}</td>
                        <td>
                        <div className="d-flex justify-content-start align-items-center gap-2 mt-2">
  <button
    className="btn btn-info"
    onClick={() => navigate(`/entreprise/candidatures/${offer.ID_Offre}`)}
  >
    Voir Les Candidatures
  </button>
  {offer.Status_Offre !== "closed" && (
    <button
      className="btn btn-danger"
      onClick={() => closeOffer(offer.ID_Offre)}
    >
      Fermer l'offre
    </button>
  )}
</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="alert alert-info text-center">
                  Aucune offre trouvée pour cette entreprise.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyOffers;
