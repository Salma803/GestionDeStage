import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListEntreprises = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State for the search input
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of entreprises from the backend
    axios
      .get('http://localhost:3001/gestionnaire/entreprises')
      .then((response) => {
        setEntreprises(response.data);
      })
      .catch((error) => {
        console.error('Error fetching entreprises:', error);
      });
  }, []);

  // Filter entreprises based on search term and sort them by name
  const filteredAndSortedEntreprises = entreprises
    .filter((entreprise) =>
      entreprise.Nom_Entreprise.toLowerCase().includes(searchTerm.toLowerCase()) // Search by name
    )
    .sort((a, b) => a.Nom_Entreprise.localeCompare(b.Nom_Entreprise)); // Sort by name in ascending order

  return (
    <div className="list-entreprises">
      <h2>Entreprises List</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Company Name"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <table>
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
                <button onClick={() => navigate(`/gestionnaire/modifyEntreprise/${entreprise.ID_Entreprise}`)}>Modify</button>
                <button onClick={() => navigate(`/gestionnaire/deleteEntreprise/${entreprise.ID_Entreprise}`)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListEntreprises;
