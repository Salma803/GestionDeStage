import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OfferDetails = () => {
  const [offer, setOffer] = useState(null);
  const { offerId } = useParams();
  console.log('Offer ID from URL:', offerId);

  useEffect(() => {
    // Fetch the offer details based on the offerId from the URL
    axios
      .get(`http://localhost:3001/etudiant/offers/${offerId}`)
      .then((response) => {
        setOffer(response.data);
      })
      .catch((error) => {
        console.error('Error fetching offer details:', error);
        alert('Failed to load offer details. Please try again later.');
      });
  }, [offerId]);

  if (!offer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="offer-details">
      <h2>Offer Details</h2>
      <h3>{offer.Titre_Offre}</h3>
      <p>{offer.Description_Offre}</p>
      <p><strong>Status:</strong> {offer.Status_Offre}</p>

      {/* Company Details */}
      <div className="company-details">
        <h4>Company Information</h4>
        <p><strong>Name:</strong> {offer.Company.Nom_Entreprise}</p>
        <p><strong>Address:</strong> {offer.Company.Adresse_Entreprise}</p>
        <p><strong>Phone:</strong> {offer.Company.Tel_Entreprise}</p>
        <p><strong>Email:</strong> {offer.Company.Email_Entreprise}</p>
      </div>

      <button onClick={() => window.history.back()}>Back to Offers</button>
    </div>
  );
};

export default OfferDetails;
