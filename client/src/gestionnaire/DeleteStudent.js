import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const DeleteStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the student details by ID to confirm deletion
    axios
      .get(`http://localhost:3001/gestionnaire/student/${id}`)
      .then((response) => {
        setStudent(response.data);
      })
      .catch((error) => {
        console.error('Error fetching student:', error);
      });
  }, [id]);

  const handleDelete = () => {
    axios
      .delete(`http://localhost:3001/gestionnaire/student/${id}`)
      .then(() => {
        navigate('/gestionnaire/ListStudents');
      })
      .catch((error) => {
        console.error('Error deleting student:', error);
      });
  };

  return (
    <div className="delete-student">
      <h2>Are you sure you want to delete this student?</h2>
      {student && (
        <div>
          <p>Name: {student.Nom_Etudiant} {student.Prenom_Etudiant}</p>
          <p>Email: {student.Email_Etudiant}</p>
          <button onClick={handleDelete}>Yes, Delete</button>
          <button onClick={() => navigate('/gestionnaire/students')}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default DeleteStudent;
