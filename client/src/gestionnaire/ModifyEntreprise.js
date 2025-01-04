import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ModifyEntreprise = () => {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState({
    Nom_Entreprise: '',
    Adresse_Entreprise: '',
    Tel_Entreprise: '',
    Email_Entreprise: '',
    MotDePasse_Entreprise: ''
  });
  const [error, setError] = useState(null); // For displaying errors
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the entreprise details by ID
    axios
      .get(`http://localhost:3001/gestionnaire/entreprise/${id}`)
      .then((response) => {
        setEntreprise(response.data);
      })
      .catch((error) => {
        console.error('Error fetching entreprise:', error);
        setError('Failed to load entreprise data');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntreprise((prevEntreprise) => ({
      ...prevEntreprise,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const updatedEntreprise = {
      ...entreprise,
    };
  
    axios
      .put(`http://localhost:3001/gestionnaire/entreprise/${id}`, updatedEntreprise)
      .then(() => {
        navigate('/gestionnaire/ListEntreprises');
      })
      .catch((error) => {
        console.error('Error updating entreprise:', error);
      });
  };

  return (
    <div className="modify-entreprise">
      <h2>Modify Entreprise</h2>
      {error && <p className="error">{error}</p>} {/* Display errors */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom</label>
          <input
            type="text"
            name="Nom_Entreprise"
            value={entreprise.Nom_Entreprise}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Adresse</label>
          <input
            type="text"
            name="Adresse_Entreprise"
            value={entreprise.Adresse_Entreprise}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Téléphone</label>
          <input
            type="text"
            name="Tel_Entreprise"
            value={entreprise.Tel_Entreprise}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="Email_Entreprise"
            value={entreprise.Email_Entreprise}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mot de Passe</label>
          <input
            type="text"
            name="MotDePasse_Entreprise"
            value={entreprise.MotDePasse_Entreprise}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Entreprise</button>
      </form>
    </div>
  );
};

export default ModifyEntreprise;
