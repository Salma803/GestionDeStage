import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component

const ModifyEntreprise = () => {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState({
    Nom_Entreprise: '',
    Adresse_Entreprise: '',
    Tel_Entreprise: '',
    Email_Entreprise: '',
    MotDePasse_Entreprise: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .put(`http://localhost:3001/gestionnaire/entreprise/${id}`, entreprise)
      .then(() => {
        navigate('/gestionnaire/ListEntreprises');
      })
      .catch((error) => {
        console.error('Error updating entreprise:', error);
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
          <h2 style={{ paddingTop :20 +'px'}}className="card-title text-center mb-4">Modifier Entreprise</h2>

            <div className="card-body">
              {error && <p className="text-danger text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                {[
                  { label: 'Nom', name: 'Nom_Entreprise' },
                  { label: 'Adresse', name: 'Adresse_Entreprise' },
                  { label: 'Téléphone', name: 'Tel_Entreprise' },
                  { label: 'Email', name: 'Email_Entreprise', type: 'email' },
                  { label: 'Mot de Passe', name: 'MotDePasse_Entreprise' },
                ].map((field) => (
                  <div className="mb-3" key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      id={field.name}
                      name={field.name}
                      className="form-control"
                      value={entreprise[field.name]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-primary w-100">
                  Update Entreprise
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyEntreprise;
