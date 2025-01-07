import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component

const DeleteEntreprise = () => {
  const { id } = useParams();
  const [entreprise, setEntreprise] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    <div className="d-flex">
      <SideNav />

      <div className="main-content w-100">
        <Header />
        <div className="container mt-4">
          <div className="card shadow-sm">
          <h2 style={{ paddingTop :20 +'px',display :'flex',justifyContent: 'center'}} className="card-title mb-4">Etes vous sur de supprimer cette Entreprise?</h2>

            <div className="card-body text-center">
              {entreprise && (
                <>
                  <p>
                    <strong>Nom:</strong> {entreprise.Nom_Entreprise}
                  </p>
                  <p>
                    <strong>Email:</strong> {entreprise.Email_Entreprise}
                  </p>
                  <p>
                    <strong>Téléphone:</strong> {entreprise.Tel_Entreprise}
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button onClick={handleDelete} className="btn btn-danger">
                      Yes, Delete
                    </button>
                    <button onClick={() => navigate('/gestionnaire/ListEntreprises')} className="btn btn-secondary">
                      Cancel
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

export default DeleteEntreprise;
