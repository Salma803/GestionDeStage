import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ModifyChefFiliere = () => {
  const { id } = useParams();
  const [chefFiliere, setChefFiliere] = useState({
    ID_CDF:'',
    Nom_CDF: '',
    Prenom_CDF: '',
    Email_CDF: '',
    Tel_CDF: '',
    FiliereAssociee_CDF: '',
    MotDePasse_CDF: ''
  });
  const [error, setError] = useState(null); // For displaying errors
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the Chef de Filière details by ID
    axios
      .get(`http://localhost:3001/gestionnaire/chefFiliere/${id}`)
      .then((response) => {
        setChefFiliere(response.data);
      })
      .catch((error) => {
        console.error('Error fetching Chef de Filière:', error);
        setError('Failed to load Chef de Filière data');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setChefFiliere((prevChefFiliere) => ({
      ...prevChefFiliere,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedChefFiliere = {
      ...chefFiliere,
    };

    axios
      .put(`http://localhost:3001/gestionnaire/chefFiliere/${id}`, updatedChefFiliere)
      .then(() => {
        navigate('/gestionnaire/ListChefsFiliere');
      })
      .catch((error) => {
        console.error('Error updating Chef de Filière:', error);
      });
  };

  return (
    <div className="modify-chefFiliere">
      <h2>Modify Chef de Filière</h2>
      {error && <p className="error">{error}</p>} {/* Display errors */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID: </label>
          <span>{chefFiliere.ID_CDF}</span>
        </div>
        <div>
          <label>Nom</label>
          <input
            type="text"
            name="Nom_CDF"
            value={chefFiliere.Nom_CDF}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Prénom</label>
          <input
            type="text"
            name="Prenom_CDF"
            value={chefFiliere.Prenom_CDF}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="Email_CDF"
            value={chefFiliere.Email_CDF}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Téléphone</label>
          <input
            type="text"
            name="Tel_CDF"
            value={chefFiliere.Tel_CDF}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Filière Associée</label>
          <input
            type="text"
            name="FiliereAssociee_CDF"
            value={chefFiliere.FiliereAssociee_CDF}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mot de Passe</label>
          <input
            type="password"
            name="MotDePasse_CDF"
            value={chefFiliere.MotDePasse_CDF}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Chef de Filière</button>
      </form>
    </div>
  );
};

export default ModifyChefFiliere;
