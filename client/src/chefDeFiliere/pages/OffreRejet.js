import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Container, Spinner, Alert } from 'react-bootstrap';
import UseAuth from "../hooks/UseAuth";
import { Link } from "react-router-dom";
import NavBar from "../Components/NavBar";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import SideNav from "../Components/SideNav";
const OffreRejet = () => {
  const isAuthenticated = UseAuth();
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
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
        <main className="offers-main">
          
  
          <h1 className="offers-title">Liste des Offres Desapprouvés</h1>
          <div className="offers-cards-container">
            {disapprovedOffers.map((offerFlag) => {
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
};

export default OffreRejet;
