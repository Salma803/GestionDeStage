import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component
import UseAuth from "../hooks/UseAuth";

const ModifyStudent = () => {
  const isAuthenticated = UseAuth();

  const { id } = useParams();
  const [student, setStudent] = useState({
    ID_Etudiant: '',
    Nom_Etudiant: '',
    Prenom_Etudiant: '',
    Date_Naissance_Etudiant: '',
    Email_Etudiant: '',
    Tel_Etudiant: '',
    Filiere_Etudiant: '',
    Annee_Etudiant: '',
    Statut_Etudiant: '',
    Statut_Recherche: '',
    MotDePasse_Etudiant: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3001/gestionnaire/student/${id}`)
      .then((response) => {
        setStudent(response.data);
      })
      .catch((error) => {
        console.error('Error fetching student:', error);
        setError('Failed to load student data');
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedDate = new Date(student.Date_Naissance_Etudiant).toISOString().split('T')[0];

    axios
      .put(`http://localhost:3001/gestionnaire/student/${id}`, {
        ...student,
        Date_Naissance_Etudiant: formattedDate,
      })
      .then(() => {
        navigate('/gestionnaire/ListStudents');
      })
      .catch((error) => {
        console.error('Error updating student:', error);
      });
  };

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
            <h2 style={{ paddingTop: 20 + 'px' }} className="card-title text-center mb-4">Modifier Etudiant</h2>

            <div className="card-body">
              {error && <p className="text-danger text-center">{error}</p>}
              <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                <div className="mb-3">
                  <label>ID</label>
                  <p className="form-control">{student.ID_Etudiant}</p>
                </div>
                {[
                  { label: 'Nom', name: 'Nom_Etudiant' },
                  { label: 'Prénom', name: 'Prenom_Etudiant' },
                  { label: 'Date de Naissance', name: 'Date_Naissance_Etudiant', type: 'date' },
                  { label: 'Email', name: 'Email_Etudiant', type: 'email' },
                  { label: 'Téléphone', name: 'Tel_Etudiant' },
                  { label: 'Mot de Passe', name: 'MotDePasse_Etudiant' },
                ].map((field) => (
                  <div className="mb-3" key={field.name}>
                    <label htmlFor={field.name}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      id={field.name}
                      name={field.name}
                      className="form-control"
                      value={student[field.name]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ))}
                <div className="mb-3">
                  <label htmlFor="Annee_Etudiant">Année</label>
                  <select
                    id="Annee_Etudiant"
                    name="Annee_Etudiant"
                    className="form-control"
                    value={student.Annee_Etudiant}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez une année</option>
                    <option value="1A">1A</option>
                    <option value="2A">2A</option>
                    <option value="3A">3A</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="Statut_Etudiant">Statut</label>
                  <select
                    id="Statut_Etudiant"
                    name="Statut_Etudiant"
                    className="form-control"
                    value={student.Statut_Etudiant}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un statut</option>
                    <option value="en cours">en cours</option>
                    <option value="diplomé">diplomé</option>
                    <option value="abandonné">abandonné</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="Statut_Recherche">Statut Recherche</label>
                  <select
                    id="Statut_Recherche"
                    name="Statut_Recherche"
                    className="form-control"
                    value={student.Statut_Recherche}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Sélectionnez un statut</option>
                    <option value="true">Oui</option>
                    <option value="false">Non</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Mis à jour Etudiant
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifyStudent;
