import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component

const DeleteChefFiliere = () => {
  const { id } = useParams();
  const [chefFiliere, setChefFiliere] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    <div className="d-flex">
      <SideNav />

      <div className="main-content w-100">
        <Header />
        <div className="container mt-4">
          <div className="card shadow-sm">
          <h2 style={{ paddingTop :20 +'px',display :'flex',justifyContent: 'center'}} className="card-title mb-4">Etes vous sur de supprimer ce chef de filière?</h2>

            <div className="card-body text-center">
              {chefFiliere && (
                <>
                  <p>
                    <strong>Name:</strong> {chefFiliere.Nom_CDF} {chefFiliere.Prenom_CDF}
                  </p>
                  <p>
                    <strong>Email:</strong> {chefFiliere.Email_CDF}
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button onClick={handleDelete} className="btn btn-danger">
                      Oui, Supprimer
                    </button>
                    <button onClick={() => navigate('/gestionnaire/ListChefsFiliere')} className="btn btn-secondary">
                      Annuler
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteChefFiliere;
