import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SideNav from "../components/SideNav";
import Header from "../components/Header";

const CompanyOffers = () => {
  const [offers, setOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        setError("Failed to fetch offers");
        console.error("Error fetching offers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  // Filter and sort offers
  const filteredAndSortedOffers = offers
    .filter((offer) =>
      offer.ID_Offre.toString().includes(searchTerm) // Search by ID
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
                  onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour le terme de recherche
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
                        <td>{offer.Status_Offre || "N/A"}</td>
                        <td>{offer.Durée || "N/A"}</td>
                        <td>{offer.Période || "N/A"}</td>
                        <td>{offer.Tuteur || "N/A"}</td>
                        <td>{offer.Keywords_Offre || "N/A"}</td>
                        <td>
                          <button
                            className="btn btn-info"
                            onClick={() =>
                              navigate(`/entreprise/candidatures/${offer.ID_Offre}`)
                            }
                          >
                            Voir Les Candidatures
                          </button>
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
