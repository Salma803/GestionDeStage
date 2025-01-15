import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component
import UseAuth from "../hooks/UseAuth";

const ModifyChefFiliere = () => {
  const isAuthenticated = UseAuth();
  const { id } = useParams();
  const [chefFiliere, setChefFiliere] = useState({
    ID_CDF: '',
    Nom_CDF: '',
    Prenom_CDF: '',
    Email_CDF: '',
    Tel_CDF: '',
    FiliereAssociee_CDF: '',
    MotDePasse_CDF: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3001/gestionnaire/chefFiliere/${id}`, chefFiliere)
      .then(() => {
        navigate('/gestionnaire/ListChefsFiliere');
      })
      .catch((error) => {
        console.error('Error updating Chef de Filière:', error);
      });
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <SideNav />

      <div className="main-content w-100">
        {/* Header */}
        <Header />

        {/* Content */}
        <div className="container mt-4">
          <div className="card shadow-sm">
          <h2 style={{ paddingTop :20 +'px'}}className="card-title text-center mb-4">Modifier Chef de Filière</h2>
            <div className="card-body">
            
              
              {error && <p className="text-danger text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                  <label>ID</label>
                  <p className="form-control">{chefFiliere.ID_CDF}</p>
                </div>
                {[
                  { label: 'Nom', name: 'Nom_CDF' },
                  { label: 'Prénom', name: 'Prenom_CDF' },
                  { label: 'Email', name: 'Email_CDF', type: 'email' },
                  { label: 'Téléphone', name: 'Tel_CDF' },
                  { label: 'Filière Associée', name: 'FiliereAssociee_CDF' },
                  { label: 'Mot de Passe', name: 'MotDePasse_CDF' },
                ].map((field) => (
                  <div className="mb-3" key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      id={field.name}
                      name={field.name}
                      className="form-control"
                      value={chefFiliere[field.name]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary w-100">
                  Mise à Jour Chef de Filière
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyChefFiliere;
