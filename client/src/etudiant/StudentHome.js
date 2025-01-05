import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const StudentOffers = () => {
  const [offers, setOffers] = useState([]);
  const [statusFlag, setStatusFlag] = useState('');
  const [idCdf, setIdCdf] = useState('');
  const [allCdf, setAllCdf] = useState([]); // To store the list of CDFs for the dropdown
  const navigate = useNavigate();

  // Fetch all offers when the component mounts
  useEffect(() => {
    axios
      .get('http://localhost:3001/etudiant/offers')
      .then((response) => {
        setOffers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching offers:', error);
      });

    // Fetch all Chef de Filière for the CDF dropdown
    axios
      .get('http://localhost:3001/gestionnaire/chefsfiliere') // Adjust this API endpoint
      .then((response) => {
        setAllCdf(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Chef de Filière:', error);
      });
  }, []);

  // Function to handle search
  const handleSearch = () => {
    // Clear previous offers before fetching new results
    setOffers([]);

    if (!statusFlag && !idCdf) {
      // If no filters are selected, fetch all offers
      axios
        .get('http://localhost:3001/etudiant/offers')
        .then((response) => {
          setOffers(response.data);
        })
        .catch((error) => {
          console.error('Error fetching offers:', error);
        });
    } else if (statusFlag && idCdf) {
      // If both filters are selected, fetch filtered offers
      axios
        .get('http://localhost:3001/etudiant/offers', {
          params: {
            statusFlag,
            idCdf,
          },
        })
        .then((response) => {
          if (response.data.length === 0) {
            setOffers([]); // Clear the offers if no results found
          } else {
            setOffers(response.data); // Set the filtered offers
          }
        })
        .catch((error) => {
          console.error('Error fetching filtered offers:', error);
        });
    } else {
      alert('Please select both Status Flag and Chef de Filière');
    }

    // Clear the filters only after search is triggered
    setStatusFlag('');
    setIdCdf('');
  };

  // Function to handle "Show All" button click
  const handleShowAll = () => {
    // Fetch all offers without any filter
    axios
      .get('http://localhost:3001/etudiant/offers')
      .then((response) => {
        setOffers(response.data);
        // Clear the filters as we are showing all offers
        setStatusFlag('');
        setIdCdf('');
      })
      .catch((error) => {
        console.error('Error fetching all offers:', error);
      });
  };

  // Handle View Offer button click
  const handleViewOffer = (offerId) => {
    navigate(`/etudiant/offer/${offerId}`); // Redirect to offer details page with the offer ID
  };

  // Handler to navigate to the profile page
  const handleViewProfile = () => {
    navigate('/etudiant/profile'); // Adjust the path to your profile page
  };

  return (
    <div className="student-offers">
      <h2>Available Internship Offers</h2>
      {/* Add the View Profile Button */}
      <button onClick={handleViewProfile}>View Profile</button>

      {/* Filter by Status Flag */}
      <select
        value={statusFlag}
        onChange={(e) => setStatusFlag(e.target.value)}
      >
        <option value="">Select Flag Status</option>
        <option value="approved">approved</option>
        <option value="rejected">rejected</option>
      </select>

      {/* Filter by Chef de Filière (ID_CDF) */}
      <select
        value={idCdf}
        onChange={(e) => setIdCdf(e.target.value)}
      >
        <option value="">Select Chef de Filière</option>
        {allCdf.map((cdf) => (
          <option key={cdf.ID_CDF} value={cdf.ID_CDF}>
            {cdf.ID_CDF}
          </option>
        ))}
      </select>

      {/* Search Button */}
      <button onClick={handleSearch}>Search</button>

      {/* "Show All" Button */}
      <button onClick={handleShowAll}>Show All</button>

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
                <td>
                <button onClick={() => handleViewOffer(offer.ID_Offre)}>View Offer</button>
                </td>
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
