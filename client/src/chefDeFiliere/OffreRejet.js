import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';

const OffreRejet = () => {
  const [userId, setUserId] = useState(null);
  const [disapprovedOffers, setDisapprovedOffers] = useState([]);
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

        if (!response.data || !response.data.ID_CDF) {
          throw new Error('Invalid user data received');
        }

        const userId = response.data.ID_CDF;
        setUserId(userId);
        
        // Wait for the disapproved offers to be fetched
        await fetchDisapprovedOffers(userId);
      } catch (error) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchDisapprovedOffers = async (id) => {
      try {
        const response = await axios.get(`http://localhost:3001/chefdefiliere/disapprovedOffers/${id}`);
        
        if (response.data.message) {
          setError(response.data.message); // Set the message as the error
          setDisapprovedOffers([]); // Set empty array if no offers
        } else {
          setDisapprovedOffers(response.data || []); // Set disapproved offers data
        }
      } catch (error) {
        
        setDisapprovedOffers([]); // Set empty array if error
      }
    };
    
    

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading disapproved offers...</p>
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
      <h2>Disapproved Offers</h2>
      {disapprovedOffers.length === 0 ? (
        <Alert variant="info">No disapproved offers found.</Alert>
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
            {disapprovedOffers.map((offerFlag) => {
              const offer = offerFlag.Offre || {};
              const company = offer.Company || {};
              return (
                <tr key={offerFlag.ID_Flag || offer.ID_Offre}>
                  <td>{offer.ID_Offre || 'N/A'}</td>
                  <td>{offer.Titre_Offre || 'N/A'}</td>
                  <td>{offer.Description_Offre || 'N/A'}</td>
                  <td>{offer.Status_Offre || 'N/A'}</td>
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

export default OffreRejet;
