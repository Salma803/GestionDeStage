import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListEntreprises = () => {
  const [entreprises, setEntreprises] = useState([]);
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

  return (
    <div className="list-entreprises">
      <h2>Entreprises List</h2>
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
          {entreprises.map((entreprise) => (
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
