import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteEntreprise = () => {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the entreprise details by ID to confirm deletion
    axios
      .get(`http://localhost:3001/gestionnaire/entreprise/${id}`)
      .then((response) => {
        setEntreprise(response.data);
      })
      .catch((error) => {
        console.error('Error fetching entreprise:', error);
      });
  }, [id]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3001/gestionnaire/entreprise/${id}`)
      .then(() => {
        navigate('/gestionnaire/ListEntreprises');
      })
      .catch((error) => {
        console.error('Error deleting entreprise:', error);
      });
  };

  return (
    <div className="delete-entreprise">
      <h2>Are you sure you want to delete this entreprise?</h2>
      {entreprise && (
        <div>
          <p>Nom: {entreprise.Nom_Entreprise}</p>
          <p>Email: {entreprise.Email_Entreprise}</p>
          <p>Téléphone: {entreprise.Tel_Entreprise}</p>
          <button onClick={handleDelete}>Yes, Delete</button>
          <button onClick={() => navigate('/gestionnaire/ListEntreprises')}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DeleteEntreprise;
