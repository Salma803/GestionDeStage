import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Alert } from 'react-bootstrap';

const CreerOffre = () => {
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
          <Form.Select
            name="status_offre"
            value={formData.status_offre}
            onChange={handleChange}
            required
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </Form.Select>
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
        <Form.Group className="mb-3" controlId="duree">
          <Form.Label>Duration</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter duration"
            name="duree"
            value={formData.duree}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="periode">
          <Form.Label>Period</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter period"
            name="periode"
            value={formData.periode}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="tuteur">
          <Form.Label>Tutor</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter tutor name"
            name="tuteur"
            value={formData.tuteur}
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
