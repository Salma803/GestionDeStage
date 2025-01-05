import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UseAuth from "../hooks/UseAuth";
import { Link } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SideNav from "../Components/SideNav";

import { Table, Container, Spinner, Alert } from 'react-bootstrap';

const OffreApprouve = () => {
  const isAuthenticated = UseAuth();
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
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main className="offers-main">
          
  
          <h1 className="offers-title">Liste des Offres Approuvées</h1>
          <div className="offers-cards-container">
            {approvedOffers.map((offerFlag) => {
              const offer = offerFlag.Offre || {};
              const company = offer.Company || {};
  
              return (
                <div key={offerFlag.ID_Flag || offer.ID_Offre} className="offer-card">
                  <h2 className="offer-title">{offer.Titre_Offre || "No Title"}</h2>
                  <p className="offer-description">
                    <strong>Description:</strong> {offer.Description_Offre || "No description available"}
                  </p>
                  <p className="offer-status">
                    <strong>Status:</strong> {offer.Status_Offre || "Pending"}
                  </p>
                  <p className="offer-keywords">
                    <strong>Keywords:</strong> {offer.Keywords_Offre ? offer.Keywords_Offre.join(", ") : "N/A"}
                  </p>
                  <div className="company-info">
                    {company ? (
                      <>
                        <p>
                          <strong>Company:</strong> {company.Nom_Entreprise || "N/A"}
                        </p>
                        <p>
                          <strong>Email:</strong> {company.Email_Entreprise || "N/A"}
                        </p>
                      </>
                    ) : (
                      <p>No company information available</p>
                    )}
                  </div>
                  
                </div>
              );
            })}
          </div>
        </main>
      
      </div>
    </div>
  );
}
  

export default OffreApprouve;
