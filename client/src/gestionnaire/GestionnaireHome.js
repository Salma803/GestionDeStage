import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const GestionnaireHome = () => {
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalInternships: 0,
    studentsWithInternships: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch statistics from the backend
    axios
      .get('http://localhost:3001/gestionnaire/statistics')
      .then((response) => {
        setStatistics(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="homepage">
      <h1>Gestionnaire Homepage</h1>

      {/* Statistics Section */}
      <div className="statistics">
        <h2>Statistics</h2>
        {loading ? (
          <p>Loading statistics...</p>
        ) : (
          <>
            <p>Total Students: {statistics.totalStudents}</p>
            <p>Total Internships: {statistics.totalInternships}</p>
            <p>Students with Internships: {statistics.studentsWithInternships}</p>
          </>
        )}
      </div>

      {/* Account Management Section */}
      <div className="actions">
        <h2>Manage Accounts</h2>

        {/* Create Options */}
        <h3>Create Accounts</h3>
        <button onClick={() => navigate('/gestionnaire/createStudent')}>Create Student</button>
        <button onClick={() => navigate('/gestionnaire/createChefFiliere')}>Create Chef de Filière</button>
        <button onClick={() => navigate('/gestionnaire/createEntreprise')}>Create Entreprise</button>

        {/* View and Manage Existing Accounts */}
        <h3>View and Manage Accounts</h3>
        <button onClick={() => navigate('/gestionnaire/listStudents')}>View Students</button>
        <button onClick={() => navigate('/gestionnaire/listChefsFiliere')}>View Chefs de Filière</button>
        <button onClick={() => navigate('/gestionnaire/listEntreprises')}>View Entreprises</button>
      </div>
    </div>
  );
};

export default GestionnaireHome;
