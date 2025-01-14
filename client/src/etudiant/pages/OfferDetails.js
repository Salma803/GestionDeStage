import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component
import UseAuth from "../hooks/UseAuth";



const OfferDetails = () => {
  const isAuthenticated = UseAuth();
  const [offer, setOffer] = useState(null);
  const [student, setStudent] = useState(null); // Store student details
  const { offerId } = useParams();
  const [status, setStatus] = useState(''); // Track application status
  const [hasApplied, setHasApplied] = useState(false); // Track if the student has applied

  useEffect(() => {
    // Fetch the student profile using the /etudiant/me endpoint
    axios
      .get('http://localhost:3001/etudiant/me', {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        setStudent(response.data); // Store student details
      })
      .catch((error) => {
        console.error('Error fetching student profile:', error);
        alert('Failed to fetch student profile. Please log in again.');
      });

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

    // Check if the student has already applied to this offer
    if (student) {
      axios
        .get(`http://localhost:3001/etudiant/candidatures/${student.ID_Etudiant}/${offerId}`)
        .then((response) => {
          setHasApplied(response.data.hasApplied); // Set the application status
        })
        .catch((error) => {
          console.error('Error checking application status:', error);
        });
    }
  }, [offerId, student]);

  const handleApply = () => {
    if (!student) {
      alert('Please log in to apply.');
      return;
    }

    // Send the application (candidature) request to the backend
    axios
      .post('http://localhost:3001/etudiant/candidater', {
        ID_Etudiant: student.ID_Etudiant,
        ID_Offre: offerId,
      })
      .then((response) => {
        setStatus('Application submitted successfully');
        setHasApplied(true); // Update application status
      })
      .catch((error) => {
        console.error('Error submitting application:', error);
        setStatus('Failed to submit application');
      });
  };

  /*const handleRemoveApplication = () => {
    if (!student) {
      alert('Please log in to remove your application.');
      return;
    }

    // Send the request to remove the application
    axios
      .delete(`http://localhost:3001/etudiant/candidatures/${student.ID_Etudiant}/${offerId}`)
      .then((response) => {
        setStatus('Application removed successfully');
        setHasApplied(false); // Update application status
      })
      .catch((error) => {
        console.error('Error removing application:', error);
        setStatus('Failed to remove application');
      });
  };*/

  if (!offer) {
    return <div>Loading...</div>;
  }

  return (
    <div className="liste-offres-page">
        <SideNav />
        <div className="content-area">
        <Header />
        <main className="offers-main">
    <div className="container my-5">
      <div className="card p-4 shadow">
        <h3 className="text-primary">{offer.Titre_Offre}</h3>
        <p>{offer.Description_Offre}</p>
        <p><strong>Statut:</strong> {offer.Status_Offre === 'open' ? 'ouverte' : 'fermée'}</p>
        <p><strong>Durée:</strong> {offer.Durée}</p>
        <p><strong>Période:</strong> {offer.Période}</p>
        <p><strong>Tuteur:</strong> {offer.Tuteur}</p>
  
        <div className="mt-4">
          <h4>Informations sur l'entreprise</h4>
          <p><strong>Nom:</strong> {offer.Company.Nom_Entreprise}</p>
          <p><strong>Adresse:</strong> {offer.Company.Adresse_Entreprise}</p>
          <p><strong>Téléphone:</strong> {offer.Company.Tel_Entreprise}</p>
          <p><strong>Email:</strong> {offer.Company.Email_Entreprise}</p>
        </div>
  
        {status && <p className="mt-3 alert alert-info">{status}</p>}
  
        <div className="d-flex gap-2 mt-4">
          {hasApplied ? (
              <p>vous avez déjà postulé à cette offre</p>
          ) : (
            <button className="btn btn-success" onClick={handleApply}>
              Candidater
            </button>
          )}
          <button className="btn btn-secondary" onClick={() => window.history.back()}>
            Retour aux Offres
          </button>
        </div>
      </div>
    </div>
    </main>
        </div>
      </div>
  );
};

export default OfferDetails;
