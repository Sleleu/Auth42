import { useState, useEffect } from 'react';
import { getUserProfile, User } from '../components/Api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile();
        setUser(userProfile);
      } catch (error) {
        console.error(error);
        navigate('/');
      }
    };
    fetchData();
  }, [navigate]);

  return (
    <>
      {user.username && (
        <div>
          <h1>Login: {user.username}</h1>
          {user.avatar && <img src={user.avatar} alt="User Avatar" />}
        </div>
      )}
    </>
  );
}

export default Home;
