import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OffersCount() {
    const [offerCount, setofferCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchofferCount = async () => {
            try {
                const response = await axios.get('http://localhost:3001/gestionnaire/statistics');
                setofferCount(response.data.totalOffers);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gift card count:', error);
                setLoading(false);
            }
        };

        fetchofferCount();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="small-box bg-gray">
            <div className="inner">
                <h3>{offerCount}</h3>
                <p>Offres</p>
            </div>
            <div className="icon">
                <i className="ion ion-ios-briefcase" />
            </div>
        </div>
    );
}

export default OffersCount;