import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all internships
    axios
      .get('http://localhost:3001/gestionnaire/internships')
      .then((response) => {
        setInternships(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching internships:', error);
        setError('An error occurred while fetching internships.');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading internships...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>List of Internships</h1>
      <table>
        <thead>
          <tr>
            <th>ID Stage</th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Date of Birth</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Filière</th>
            <th>Year</th>
            <th>Company Name</th>
            <th>Company Address</th>
            <th>Company Phone</th>
            <th>Company Email</th>
            <th>Offer Title</th>
            <th>Offer Description</th>
            <th>Duration</th>
            <th>Period</th>
            <th>Supervisor</th>
          </tr>
        </thead>
        <tbody>
          {internships.map((stage) => (
            <tr key={stage.ID_Stage}>
              <td>{stage.ID_Stage}</td>
              <td>{stage.ID_Etudiant}</td>
              <td>
                {stage.Prenom_Etudiant} {stage.Nom_Etudiant}
              </td>
              <td>{stage.Date_Naissance_Etudiant}</td>
              <td>{stage.Email_Etudiant}</td>
              <td>{stage.Tel_Etudiant}</td>
              <td>{stage.Filiere_Etudiant}</td>
              <td>{stage.Annee_Etudiant}</td>
              <td>{stage.Nom_Entreprise}</td>
              <td>{stage.Adresse_Entreprise}</td>
              <td>{stage.Tel_Entreprise}</td>
              <td>{stage.Email_Entreprise}</td>
              <td>{stage.Titre_Offre}</td>
              <td>{stage.Description_Offre}</td>
              <td>{stage.Durée}</td>
              <td>{stage.Période}</td>
              <td>{stage.Tuteur}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListInternships;
