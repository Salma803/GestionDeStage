import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListStudents = () => {
  const [students, setStudents] = useState([]);
  const [searchID, setSearchID] = useState('');  // State for search by ID
  const [searchFiliere, setSearchFiliere] = useState('');  // State for search by Filière
  const [searchStatut, setSearchStatut] = useState('');  // State for search by Statut Recherche
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the list of students from the backend
    axios
      .get('http://localhost:3001/gestionnaire/students')
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, []);

  // Filter students based on search criteria and sort them by ID
  const filteredAndSortedStudents = students
    .filter((student) =>
      student.ID_Etudiant.toLowerCase().includes(searchID.toLowerCase()) &&  // Search by ID
      student.Filiere_Etudiant.toLowerCase().includes(searchFiliere.toLowerCase()) && // Search by Filière
      student.Statut_Recherche.toLowerCase().includes(searchStatut.toLowerCase())  // Search by Statut Recherche
    )
    .sort((a, b) => a.ID_Etudiant.localeCompare(b.ID_Etudiant));  // Sort by ID in ascending order

  return (
    <div className="list-students">
      <h2>Students List</h2>

      {/* Search Filters */}
      <div className="search-filters">
        <input
          type="text"
          placeholder="Search by ID"
          value={searchID}
          onChange={(e) => setSearchID(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Filière"
          value={searchFiliere}
          onChange={(e) => setSearchFiliere(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Statut Recherche"
          value={searchStatut}
          onChange={(e) => setSearchStatut(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Année</th>
            <th>Date de Naissance</th>
            <th>Téléphone</th>
            <th>CV</th>
            <th>Filière</th>
            <th>Statut Recherche</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedStudents.map((student) => (
            <tr key={student.ID_Etudiant}>
              <td>{student.ID_Etudiant}</td>
              <td>{student.Nom_Etudiant}</td>
              <td>{student.Prenom_Etudiant}</td>
              <td>{student.Email_Etudiant}</td>
              <td>{student.Annee_Etudiant}</td>
              <td>{new Date(student.Date_Naissance_Etudiant).toLocaleDateString()}</td>
              <td>{student.Tel_Etudiant}</td>
              <td>
                {student.CV_Etudiant ? (
                  <a href={student.CV_Etudiant} target="_blank" rel="noopener noreferrer">
                    View CV
                  </a>
                ) : (
                  'No CV Available'
                )}
              </td>
              <td>{student.Filiere ? `${student.Filiere_Etudiant}` : 'No Filière'}</td>
              <td>{student.Statut_Recherche}</td>
              <td>
                <button onClick={() => navigate(`/gestionnaire/modifyStudent/${student.ID_Etudiant}`)}>Modify</button>
                <button onClick={() => navigate(`/gestionnaire/deleteStudent/${student.ID_Etudiant}`)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListStudents;
