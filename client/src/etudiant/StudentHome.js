import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate

const StudentOffers = () => {
  const [offers, setOffers] = useState([]);
  const [statusFlag, setStatusFlag] = useState('');
  const [idCdf, setIdCdf] = useState('');
  const [allCdf, setAllCdf] = useState([]); // To store the list of CDFs for the dropdown

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
  };


  return (
    <div className="student-offers">
      <h2>Available Internship Offers</h2>

      <select value={statusFlag} onChange={(e) => setStatusFlag(e.target.value)}>
        <option value="">Select Flag Status</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
      </select>

      <select value={idCdf} onChange={(e) => setIdCdf(e.target.value)}>
        <option value="">Select Chef de Filière</option>
        {allCdf.map((cdf) => (
          <option key={cdf.ID_CDF} value={cdf.ID_CDF}>
            {cdf.ID_CDF}
          </option>
        ))}
      </select>

      <button onClick={handleSearch}>Search</button>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {offers.length > 0 ? (
            offers.map((offer) => (
              <tr key={offer.ID_Offre}>
                <td>{offer.Titre_Offre}</td>
                <td>{offer.Description_Offre}</td>
                <td>{offer.Status_Offre}</td>
                <Link to={`/etudiant/offer/${offer.ID_Offre}`}>
                  <button>View Offer</button>
                </Link>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No offers found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentOffers;
