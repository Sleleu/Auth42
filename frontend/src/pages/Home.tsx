import { useState, useEffect } from 'react';
import { getUserProfile, User, logout } from '../components/Api';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Partial<User>>({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout(); // Call the logout API
      // Wait for 1 second before navigating
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error(error);
      alert('Failed to log out');
    }
  };

  if (isLoggingOut) {
    return <p>Disconnecting...</p>
  } else {
    return (
      <>
        <div>
          <h1>Login: {user.username}</h1>
          {user.avatar && <img src={user.avatar} alt="User Avatar" />}
        </div>
        <button onClick={handleLogout}>Logout</button>
      </>
    );
  }
}

export default Home;
