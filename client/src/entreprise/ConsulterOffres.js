import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';

const CompanyOffers = ({ companyId }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/entreprise/offresParEntreprise/1');
        setOffers(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch offers.');
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [companyId]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading offers...</p>
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
      <h2>Offers for Company ID: {companyId}</h2>
      {offers.length > 0 ? (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Keywords</th>
              <th>Company Name</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => {
              const company = offer.Company || {};
              return (
                <tr key={offer.ID_Offre}>
                  <td>{offer.ID_Offre}</td>
                  <td>{offer.Titre_Offre || 'N/A'}</td>
                  <td>{offer.Description_Offre || 'N/A'}</td>
                  <td>{offer.Status_Offre || 'N/A'}</td>
                  <td>{offer.Keywords_Offre || 'N/A'}</td>
                  <td>{company.Nom_Entreprise || 'N/A'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info">No offers found for this company.</Alert>
      )}
    </Container>
  );
};

export default CompanyOffers;
