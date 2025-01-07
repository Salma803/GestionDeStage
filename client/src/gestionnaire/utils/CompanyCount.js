import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CompanyCount() {
    const [companyCount, setCompanyCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompanyCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/gestionnaire/statistics');
                setCompanyCount(response.data.totalCompanys);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gift card count:', error);
                setLoading(false);
            }
        };

        fetchCompanyCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="small-box bg-yellow">
            <div className="inner">
                <h3>{companyCount}</h3>
                <p>Companies</p>
            </div>
            <div className="icon">
                <i className="ion ion-ios-briefcase" />
            </div>
        </div>
    );
}

export default CompanyCount;