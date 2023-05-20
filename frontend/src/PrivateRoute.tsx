import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const navigate = useNavigate();
  const [isLogged, setLogged] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const response = await fetch("http://localhost:5000/users/profile", {
          credentials: 'include'
        });

        if (response.status === 403) {
          setLogged(false);
          return;
        }

        if (response.ok) {
          setLogged(true);
        } else {
          setLogged(false);
        }
      } catch (error) {
        setLogged(false);
      }
    };

    checkUserToken();
  }, []);

  useEffect(() => {
    if (!isLogged) {
      const navigateWithDelay = setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);

      return () => clearTimeout(navigateWithDelay);
    }
  }, [isLogged, navigate]);

  if (isLogged) {
    return children;
  }

  return <div>You're not logged, return to the login page...</div>;
};

export default PrivateRoute;
