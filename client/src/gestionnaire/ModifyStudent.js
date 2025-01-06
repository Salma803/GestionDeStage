import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ModifyStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState({
    ID_Etudiant:'',
    Nom_Etudiant: '',
    Prenom_Etudiant: '',
    Date_Naissance_Etudiant: '',
    Email_Etudiant: '',
    Tel_Etudiant: '',
    CV_Etudiant: '',
    Filiere_Etudiant: '',
    Annee_Etudiant: '',
    Statut_Recherche: '',
    MotDePasse_Etudiant: ''
  });
  const [error, setError] = useState(null); // For displaying errors
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the student details by ID
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
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const formattedDate = new Date(student.Date_Naissance_Etudiant).toISOString().split('T')[0];
  
    const updatedStudent = {
      ...student,
      Date_Naissance_Etudiant: formattedDate, // Send as 'YYYY-MM-DD'
    };
  
    axios
      .put(`http://localhost:3001/gestionnaire/student/${id}`, updatedStudent)
      .then(() => {
        navigate('/gestionnaire/ListStudents');
      })
      .catch((error) => {
        console.error('Error updating student:', error);
      });
  };
  

  return (
    <div className="modify-student">
      <h2>Modify Student</h2>
      {error && <p className="error">{error}</p>} {/* Display errors */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID: </label>
          <span>{student.ID_Etudiant}</span>
        </div>
        <div>
          <label>Nom</label>
          <input
            type="text"
            name="Nom_Etudiant"
            value={student.Nom_Etudiant}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Prénom</label>
          <input
            type="text"
            name="Prenom_Etudiant"
            value={student.Prenom_Etudiant}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Date de naissance</label>
          <input
            type="date"
            name="Date_Naissance_Etudiant"
            value={student.Date_Naissance_Etudiant}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="Email_Etudiant"
            value={student.Email_Etudiant}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Téléphone</label>
          <input
            type="text"
            name="Tel_Etudiant"
            value={student.Tel_Etudiant}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Filière</label>
          <input
            type="text"
            name="Filiere_Etudiant"
            value={student.Filiere_Etudiant}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Année</label>
          <input
            type="text"
            name="Annee_Etudiant"
            value={student.Annee_Etudiant}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Statut Recherche</label>
          <input
            type="text"
            name="Statut_Recherche"
            value={student.Statut_Recherche}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mot de Passe</label>
          <input
            type="text"
            name="MotDePasse_Etudiant"
            value={student.MotDePasse_Etudiant}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Student</button>
      </form>
    </div>
  );
};

export default ModifyStudent;
