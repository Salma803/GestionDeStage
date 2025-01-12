import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component
import UseAuth from "../hooks/UseAuth";


const StudentOffers = () => {
  const isAuthenticated = UseAuth();
  const [offers, setOffers] = useState([]);
  const [statusFlag, setStatusFlag] = useState('');
  const [idCdf, setIdCdf] = useState('');
  const [allCdf, setAllCdf] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/etudiant/offers')
      .then((response) => {
        setOffers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching offers:', error);
      });

    axios
      .get('http://localhost:3001/gestionnaire/chefsfiliere')
      .then((response) => {
        setAllCdf(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Chef de Filière:', error);
      });
  }, []);

  const handleSearch = () => {
    setOffers([]);

    if (!statusFlag && !idCdf) {
      axios
        .get('http://localhost:3001/etudiant/offers')
        .then((response) => {
          setOffers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching offers:', error);
        });
    } else if (statusFlag && idCdf) {
      axios
        .get('http://localhost:3001/etudiant/offers', {
          params: {
            statusFlag,
            idCdf,
          },
        })
        .then((response) => {
          setOffers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching filtered offers:', error);
        });
    } else {
      alert('Please select both Status Flag and Chef de Filière');
    }

    setStatusFlag('');
    setIdCdf('');
  };

  const handleShowAll = () => {
    axios
      .get('http://localhost:3001/etudiant/offers')
      .then((response) => {
        setOffers(response.data);
        setStatusFlag('');
        setIdCdf('');
      })
      .catch((error) => {
        console.error('Error fetching all offers:', error);
      });
  };

  const handleViewOffer = (offerId) => {
    navigate(`/etudiant/offer/${offerId}`);
  };

  return (
    <div className="liste-offres-page">
        <SideNav />
        <div className="content-area">
        <Header />
        <main className="offers-main">
    <div className="container mt-5">
      <h1 className="text-center mb-4">Offres des Entreprises</h1>

      <div className="row mb-3">
        {/* Filtrer par Statut */}
        <div className="col-md-6">
          
          <select
            id="statusFlag"
            className="form-select"
            value={statusFlag}
            onChange={(e) => setStatusFlag(e.target.value)}
          >
            <option value="">Sélectionner le statut</option>
            <option value="approved">Approuvé</option>
            <option value="rejected">Rejeté</option>
          </select>
        </div>

        {/* Filtrer par Chef de Filière */}
        <div className="col-md-6">
          
          <select
            id="cdf"
            className="form-select"
            value={idCdf}
            onChange={(e) => setIdCdf(e.target.value)}
          >
            <option value="">Sélectionner le Chef de Filière</option>
            {allCdf.map((cdf) => (
              <option key={cdf.ID_CDF} value={cdf.ID_CDF}>
                {cdf.ID_CDF}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <button className="btn btn-outline-danger" onClick={handleSearch}>
          Rechercher
        </button>
        <button className="btn btn-outline-secondary" onClick={handleShowAll}>
          Afficher tout
        </button>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-secondary">
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.length > 0 ? (
            offers.map((offer) => (
              <tr key={offer.ID_Offre}>
                <td>{offer.Titre_Offre}</td>
                <td>{offer.Description_Offre}</td>
                <td>{offer.Status_Offre === 'open'? 'ouverte' : 'Fermée'}</td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleViewOffer(offer.ID_Offre)}
                  >
                    Voir Offre
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">
                Aucune offre trouvée.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </main>
        </div>
      </div>
  );
};

export default StudentOffers;
