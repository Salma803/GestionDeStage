import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import UseAuth from "../hooks/UseAuth";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CreerOffre = () => {
  const isAuthenticated = UseAuth();

  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    titre_offre: '',
    description_offre: '',
    status_offre: 'open', // Default value
    keywords_offre: '',
    id_company: '', // Set automatically
    duree: '',
    periode: '',
    tuteur: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/entreprise/me', {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
          },
        });
        setUserId(response.data.ID_Entreprise);
        setFormData((prevData) => ({
          ...prevData,
          id_company: response.data.ID_Entreprise, // Automatically set company ID
        }));
      } catch (error) {
        setError('Failed to fetch user data');
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3001/entreprise/creerOffre', formData, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
        },
      });
      setSuccess('Offer created successfully!');
      setFormData({
        titre_offre: '',
        description_offre: '',
        status_offre: 'open', // Reset to default
        keywords_offre: '',
        id_company: userId, // Keep company ID
        duree: '',
        periode: '',
        tuteur: '',
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create offer');
    }
  };

  return (
    <div className="liste-offres-page">
      <SideNav />
      <div className="content-area">
        <Header />
    <Container className="mt-5">
      <h2 style={{display:'flex',justifyContent:'center'}}>Créer une nouvelle offre</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="titre_offre">
          <Form.Label>Titre</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez un titre"
            name="titre_offre"
            value={formData.titre_offre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="description_offre">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            placeholder="Entrez une description"
            name="description_offre"
            value={formData.description_offre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="keywords_offre">
          <Form.Label>Mots-Clés</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez des mots clés (séparés par des virgules)"
            name="keywords_offre"
            value={formData.keywords_offre}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="duree">
          <Form.Label>Durée</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez la durée de stage"
            name="duree"
            value={formData.duree}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="periode">
          <Form.Label>Période</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez la période de stage "
            name="periode"
            value={formData.periode}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="tuteur">
          <Form.Label>Tuteur</Form.Label>
          <Form.Control
            type="text"
            placeholder="Entrez le nom du tuteur"
            name="tuteur"
            value={formData.tuteur}
            onChange={handleChange}
          />
        </Form.Group>
        
        <Button variant="success" type="submit">
          Créer l'offre
        </Button>
      </Form>
    </Container>
    </div>
    </div>
  );
};

export default CreerOffre;