import React, { useEffect, useState } from 'react';
import axios from 'axios';

const GestionnaireStatistics = () => {
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    totalInternships: 0,
    studentsWithInternships: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch statistics from the backend
    axios
      .get('/api/statistics')
      .then((response) => {
        setStatistics(response.data);
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching statistics:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="statistics-page">
      <h1>Gestionnaire Statistics</h1>
      
      {/* Display statistics */}
      {loading ? (
        <p>Loading statistics...</p>
      ) : (
        <div className="statistics">
          <p>Total Students: {statistics.totalStudents}</p>
          <p>Total Internships: {statistics.totalInternships}</p>
          <p>Students with Internships: {statistics.studentsWithInternships}</p>
        </div>
      )}
    </div>
  );
};

export default GestionnaireStatistics;
