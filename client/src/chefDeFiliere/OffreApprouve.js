import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';

const OffreApprouve = () => {
  const [userId, setUserId] = useState(null);
  const [approvedOffers, setApprovedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/chefdefiliere/me', {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setUserId(response.data.ID_CDF);
        await fetchApprovedOffers(response.data.ID_CDF);
      } catch (error) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

const fetchApprovedOffers = async (id) => {
  try {
    const response = await axios.get(`http://localhost:3001/chefdefiliere/approvedOffers/${id}`);
    
    if (!response.status === 404) {
      setError('No approved offers found.');
      setApprovedOffers([]); // Set empty array if no offers
    } else if (response.status === 500) {
      setError('Failed to fetch approved offers');
      setApprovedOffers([]); // Set empty array in case of server error
    } else {
      setApprovedOffers(response.data || []); // Set approved offers data
    }
  } catch (error) {
    
    setApprovedOffers([]); // Set empty array if error occurs
  }
};


    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading approved offers...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2>Approved Offers</h2>
      {approvedOffers.length === 0 ? (
        <Alert variant="info">No approved offers found.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Keywords</th>
              <th>Company Name</th>
              <th>Company Email</th>
            </tr>
          </thead>
          <tbody>
            {approvedOffers.map((offerFlag) => {
              const offer = offerFlag.Offre || {};
              const company = offer.Company || {};
              return (
                <tr key={offerFlag.ID_Flag || offer.ID_Offre}>
                  <td>{offer.ID_Offre || 'N/A'}</td>
                  <td>{offer.Titre_Offre || 'N/A'}</td>
                  <td>{offer.Description_Offre || 'N/A'}</td>
                  <td>{offer.Status_Offre || 'N/A'}</td>
                  <td>{offer.Durée || 'N/A'}</td>
                  <td>{offer.Période || 'N/A'}</td>
                  <td>{offer.Tuteur || 'N/A'}</td>
                  <td>{offer.Keywords_Offre ? offer.Keywords_Offre.join(', ') : 'N/A'}</td>
                  <td>{company.Nom_Entreprise || 'N/A'}</td>
                  <td>{company.Email_Entreprise || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OffreApprouve;
