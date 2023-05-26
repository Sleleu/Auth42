import { useState, useEffect } from 'react';
import { getUserProfile, User, logout } from '../components/Api';
import { useNavigate } from 'react-router-dom';
import { enableTwoFA } from '../components/Api';
import TwoFASetup from './Generate2FA';

function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState<Partial<User>>({});
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isEnablingTwoFA, setIsEnablingTwoFA] = useState(false);

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
      await logout();
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error(error);
      alert('Failed to log out');
    }
  };

  const handleEnableTwoFA = async () => {
	try {
		await enableTwoFA();
		alert('Two-factor authentication enabled successfully');
    navigate('/TwoFASetup');
  } catch (error) {
		console.error(error);
		alert('Failed to enable two-factor authentication');
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
        <button onClick={handleEnableTwoFA}>Enable Two Factor Authentication</button>
       <button onClick={handleLogout}>Logout</button>
      </>
    );
  }
}

export default Home;
