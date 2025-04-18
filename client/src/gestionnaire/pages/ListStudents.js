import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component
import UseAuth from "../hooks/UseAuth";

const ListStudents = () => {
  const isAuthenticated = UseAuth();
  const [students, setStudents] = useState([]);
  const [searchID, setSearchID] = useState('');
  const [searchFiliere, setSearchFiliere] = useState('');
  const [searchStatut, setSearchStatut] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3001/gestionnaire/students')
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error('Error fetching students:', error);
      });
  }, []);

  const filteredAndSortedStudents = students
    .filter(
      (student) =>
        student.ID_Etudiant.toString().includes(searchID) &&
        student.Filiere_Etudiant.toLowerCase().includes(searchFiliere.toLowerCase()) &&
        student.Statut_Recherche.toLowerCase().includes(searchStatut.toLowerCase())
    )
    .sort((a, b) => a.ID_Etudiant.localeCompare(b.ID_Etudiant));

  return (
    <div className="d-flex">
      <SideNav />
      <div className="main-content w-100">
        <Header />
        <div className="container mt-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Students List</h2>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Rechercher par ID"
                  value={searchID}
                  onChange={(e) => setSearchID(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Rechercher par Filière"
                  value={searchFiliere}
                  onChange={(e) => setSearchFiliere(e.target.value)}
                />
                
              <select
                className="form-control"
                value={searchStatut}
                onChange={(e) => setSearchStatut(e.target.value)}
              >
                <option value="">Rechercher par Stage Trouvé</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
              </div>
              <table className="table table-bordered table-striped">
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
                    <th>Statut</th>
                    <th>Stage Trouvé</th>
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
                      <td>
                        {new Date(student.Date_Naissance_Etudiant).toLocaleDateString()}
                      </td>
                      <td>{student.Tel_Etudiant}</td>
                      <td>
                        {student.CV_Etudiant ? (
                          <a href={student.CV_Etudiant} target="_blank" rel="noopener noreferrer">
                            Consulter CV
                          </a>
                        ) : (
                          'Aucun CV posté'
                        )}
                      </td>
                      <td>{student.Filiere_Etudiant}</td>
                      <td>{student.Statut_Etudiant}</td>
                      <td>{student.Statut_Recherche === 'false' ? "non" : "oui"}</td>
                      <td>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() =>
                            navigate(`/gestionnaire/modifyStudent/${student.ID_Etudiant}`)
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

export default ListStudents;
