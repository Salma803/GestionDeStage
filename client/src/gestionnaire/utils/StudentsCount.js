import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentsCount() {
    const [studentCount, setstudentCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchstudentCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/gestionnaire/statistics');
                setstudentCount(response.data.totalStudents);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gift card count:', error);
                setLoading(false);
            }
        };

        fetchstudentCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="small-box bg-yellow">
            <div className="inner">
                <h3>{studentCount}</h3>
                <p>Etudiants</p>
            </div>
            <div className="icon">
                <i className="ion ion-person" />
            </div>
        </div>
    );
}

export default StudentsCount;