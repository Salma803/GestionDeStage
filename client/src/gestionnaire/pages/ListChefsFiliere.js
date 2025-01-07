import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component

const ListChefsFiliere = () => {
  const [chefsFiliere, setChefsFiliere] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of chefs de filière from the backend
    axios
      .get('http://localhost:3001/gestionnaire/chefsfiliere')
      .then((response) => {
        setChefsFiliere(response.data);
      })
      .catch((error) => {
        console.error('Error fetching chefs de filière:', error);
      });
  }, []);

  // Filter chefs based on search term and sort them by ID
  const filteredAndSortedChefs = chefsFiliere
    .filter((chef) => chef.ID_CDF.toString().includes(searchTerm)) // Search by ID
    .sort((a, b) => a.ID_CDF - b.ID_CDF); // Sort by ID in ascending order

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
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Chefs de Filière List</h2>

              {/* Search Input */}
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
                />
              </div>

              {/* Table */}
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Filière Associée</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedChefs.map((chef) => (
                    <tr key={chef.ID_CDF}>
                      <td>{chef.ID_CDF}</td>
                      <td>{chef.Nom_CDF}</td>
                      <td>{chef.Prenom_CDF}</td>
                      <td>{chef.Email_CDF}</td>
                      <td>{chef.Tel_CDF}</td>
                      <td>{chef.FiliereAssociee_CDF}</td>
                      <td>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => navigate(`/gestionnaire/modifyChefFiliere/${chef.ID_CDF}`)}
                        >
                          Modify
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

export default ListChefsFiliere;
