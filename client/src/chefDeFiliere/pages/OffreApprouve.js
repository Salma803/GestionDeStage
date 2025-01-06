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
        const userId = response.data.ID_CDF;
        setUserId(userId);
        await fetchApprovedOffers(userId);
      } catch (error) {
        setError('Failed to fetch user data.');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchApprovedOffers = async (id) => {
      try {
        const response = await axios.get(`http://localhost:3001/chefdefiliere/approvedOffers/${id}`);
        if (response.status === 200 && response.data) {
          setApprovedOffers(response.data);
        } else if (response.status === 404) {
          setError('No approved offers found.');
          setApprovedOffers([]);
        } else {
          throw new Error('Unexpected server response');
        }
      } catch (error) {
        
        setApprovedOffers([]);
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
            {approvedOffers.length > 0 ? (
              approvedOffers.map((offerFlag) => {
                const offer = offerFlag.Offre || {};
                const company = offer.Company || {};

                return (
                  <div key={offerFlag.ID_Flag || offer.ID_Offre} className="offer-card">
                    <h2 className="offer-title">{offer.Titre_Offre || "No Title"}</h2>
                <p className="offer-description">
                  <strong>Description du stage:</strong>{" "}
                  {offer.Description_Offre || "No description available"}
                </p>
                <p className="offer-description">
                  <strong>Durée du stage:</strong>{" "}
                  {offer.Durée || "No Duree available"}
                </p>
                <p className="offer-description">
                  <strong>Mots-clés du stage:</strong>{" "}
                  {offer.Période || "No period available"}
                </p>
                <p className="offer-description">
                  <strong>Mots-clés du stage:</strong>{" "}
                  {offer.Keywords_Offre || "No Keywords available"}
                </p>

                <p className="offer-status">
                  <strong>Status:</strong> {offer.Status_Offre || "Pending"}
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
              })
            ) : (
              <p className="text-center">No approved offers available.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OffreApprouve;
