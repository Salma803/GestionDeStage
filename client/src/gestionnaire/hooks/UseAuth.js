import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UseAuth = (redirectPath = '/chefdefiliere/login') => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true; // Prevent updates if component unmounts

        const checkAuth = async () => {
            const token = sessionStorage.getItem("accessToken");
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                navigate(redirectPath);
                return;
            }

            try {
                const response = await axios.get('http://localhost:3001/checkauth', {
                    headers: {
                        accessToken: token,
                    },
                });
                if (isMounted) {
                    setIsAuthenticated(response.status === 200);
                }
            } catch (error) {
                if (isMounted) {
                    console.error('Error checking authentication:', error);
                    setIsAuthenticated(false);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false; // Cleanup
        };
    }, [navigate, redirectPath]);

    return { isAuthenticated, isLoading };
};

export default UseAuth;
