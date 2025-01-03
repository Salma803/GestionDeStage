import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteChefFiliere = () => {
  const { id } = useParams();
  const [chefFiliere, setChefFiliere] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the Chef de Filière details by ID to confirm deletion
    axios
      .get(`http://localhost:3001/gestionnaire/chefFiliere/${id}`)
      .then((response) => {
        setChefFiliere(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Chef de Filière:', error);
      });
  }, [id]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3001/gestionnaire/chefFiliere/${id}`)
      .then(() => {
        navigate('/gestionnaire/ListChefsFiliere');
      })
      .catch((error) => {
        console.error('Error deleting Chef de Filière:', error);
      });
  };

  return (
    <div className="delete-chefFiliere">
      <h2>Are you sure you want to delete this Chef de Filière?</h2>
      {chefFiliere && (
        <div>
          <p>Name: {chefFiliere.Nom_CDF} {chefFiliere.Prenom_CDF}</p>
          <p>Email: {chefFiliere.Email_CDF}</p>
          <button onClick={handleDelete}>Yes, Delete</button>
          <button onClick={() => navigate('/gestionnaire/ListChefFiliere')}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DeleteChefFiliere;
