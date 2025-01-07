import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentsInternshipCount() {
    const [studentWithInternshipsCount, setstudentWithInternshipsCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchstudentWithInternshipsCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/gestionnaire/statistics');
                setstudentWithInternshipsCount(response.data.studentsWithInternships);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gift card count:', error);
                setLoading(false);
            }
        };

        fetchstudentWithInternshipsCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="small-box bg-green">
            <div className="inner">
                <h3>{studentWithInternshipsCount}</h3>
                <p>Students with Internships</p>
            </div>
            <div className="icon">
                <i className="ion ion-checkmark" />
            </div>
        </div>
    );
}

export default StudentsInternshipCount;