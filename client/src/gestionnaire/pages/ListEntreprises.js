import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component

const ListEntreprises = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/gestionnaire/entreprises')
      .then((response) => {
        setEntreprises(response.data);
      })
      .catch((error) => {
        console.error('Error fetching entreprises:', error);
      });
  }, []);

  const filteredAndSortedEntreprises = entreprises
    .filter((entreprise) =>
      entreprise.Nom_Entreprise.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.Nom_Entreprise.localeCompare(b.Nom_Entreprise));

  return (
    <div className="d-flex">
      <SideNav />
      <div className="main-content w-100">
        <Header />
        <div className="container mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Entreprises List</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by Company Name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Adresse</th>
                    <th>Téléphone</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedEntreprises.map((entreprise) => (
                    <tr key={entreprise.ID_Entreprise}>
                      <td>{entreprise.Nom_Entreprise}</td>
                      <td>{entreprise.Email_Entreprise}</td>
                      <td>{entreprise.Adresse_Entreprise}</td>
                      <td>{entreprise.Tel_Entreprise}</td>
                      <td>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() =>
                            navigate(`/gestionnaire/modifyEntreprise/${entreprise.ID_Entreprise}`)
                          }
                        >
                          Modifier
                        </button>
                        
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListEntreprises;
