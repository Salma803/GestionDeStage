import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';

const OffreRejet = ({ chefFiliereId }) => {
  const [approvedOffers, setApprovedOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApprovedOffers = async () => {
      try {
        const response = await axios.get(
          'http://localhost:3001/chefdefiliere/disapprovedOffers/1'
        );
        setApprovedOffers(response.data);
      } catch (err) {
        setError(
          err.response?.data?.message || 'Failed to fetch disapproved offers.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedOffers();
  }, [chefFiliereId]);

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
            {approvedOffers.map((offerFlag) => {
              const offer = offerFlag.Offre || {};
              const company = offer.Company || {};
              return (
                <tr key={offer.ID_Offre || offerFlag.ID_Flag}>
                  <td>{offer.ID_Offre || 'N/A'}</td>
                  <td>{offer.Titre_Offre || 'N/A'}</td>
                  <td>{offer.Description_Offre || 'N/A'}</td>
                  <td>{offer.Status_Offre || 'N/A'}</td>
                  <td>{offer.Keywords_Offre || 'N/A'}</td>
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
