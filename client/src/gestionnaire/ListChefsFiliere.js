import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListChefsFiliere = () => {
  const [chefsFiliere, setChefsFiliere] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for search term by ID
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
    <div className="list-chefs-filiere">
      <h2>Chefs de Filière List</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term
      />

      <table>
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
                <button onClick={() => navigate(`/gestionnaire/modifyChefFiliere/${chef.ID_CDF}`)}>Modify</button>
                <button onClick={() => navigate(`/gestionnaire/deleteChefFiliere/${chef.ID_CDF}`)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListChefsFiliere;
