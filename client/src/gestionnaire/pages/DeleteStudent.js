import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import SideNav from '../components/SideNav'; // Assuming you have a SideNav component
import Header from '../components/Header'; // Assuming you have a Header component

const DeleteStudent = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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
    <div className="d-flex">
      <SideNav />

      <div className="main-content w-100">
        <Header />
        <div className="container mt-4">
          <div className="card shadow-sm">
          <h2 style={{ paddingTop :20 +'px',display :'flex',justifyContent: 'center'}} className="card-title mb-4">Etes vous sur de supprimer cet Etudiant?</h2>
            <div className="card-body text-center">
              {student && (
                <>
                  <p>
                    <strong>Name:</strong> {student.Nom_Etudiant} {student.Prenom_Etudiant}
                  </p>
                  <p>
                    <strong>Email:</strong> {student.Email_Etudiant}
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button onClick={handleDelete} className="btn btn-danger">
                      Yes, Delete
                    </button>
                    <button onClick={() => navigate('/gestionnaire/students')} className="btn btn-secondary">
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteStudent;
