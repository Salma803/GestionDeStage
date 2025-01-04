import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListStudents = () => {
  const [students, setStudents] = useState([]);
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

  return (
    <div className="list-students">
      <h2>Students List</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Date de Naissance</th>
            <th>Téléphone</th>
            <th>CV</th>
            <th>Filière</th>
            <th>Statut Recherche</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.ID_Etudiant}>
              <td>{student.ID_Etudiant}</td>
              <td>{student.Nom_Etudiant}</td>
              <td>{student.Prenom_Etudiant}</td>
              <td>{student.Email_Etudiant}</td>
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
              <td>{student.Filiere ? `${student.Filiere.FiliereAssociee_CDF}` : 'No Filière'}</td>
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
