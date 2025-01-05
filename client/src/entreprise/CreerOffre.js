import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const CreerOffre = () => {
  const [userId, setUserId] = useState(null);
  const [formData, setFormData] = useState({
    titre_offre: '',
    description_offre: '',
    status_offre: '',
    keywords_offre: '', // We will split this into an array when sending
    id_company: '', // This will be set automatically based on user data
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

    // Convert the comma-separated keywords string to an array
    const keywordsArray = formData.keywords_offre
      ? formData.keywords_offre.split(',').map((keyword) => keyword.trim())
      : [];

    const dataToSend = { ...formData, keywords_offre: keywordsArray };

    try {
      const response = await axios.post('http://localhost:3001/entreprise/creerOffre', dataToSend);
      setSuccess('Offer created successfully!');
      setFormData({
        titre_offre: '',
        description_offre: '',
        status_offre: '',
        keywords_offre: '',
        id_company: userId, // Keep the company ID unchanged after successful submission
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create offer');
    }
  };

  return (
    <Container className="mt-5">
      <div><Link to="/entreprise/consulteroffres">Voir les Offres</Link></div>
      <h2>Create New Offer</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="titre_offre">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter offer title"
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
            placeholder="Enter offer description"
            name="description_offre"
            value={formData.description_offre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="status_offre">
          <Form.Label>Status</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter offer status (open/closed)"
            name="status_offre"
            value={formData.status_offre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="keywords_offre">
          <Form.Label>Keywords</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter keywords (comma-separated)"
            name="keywords_offre"
            value={formData.keywords_offre}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="id_company">
          <Form.Label>Company ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Company ID will be set automatically"
            name="id_company"
            value={formData.id_company}
            disabled
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Offer
        </Button>
      </Form>
    </Container>
  );
};

export default CreerOffre;
