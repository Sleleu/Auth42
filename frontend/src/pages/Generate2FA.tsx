import { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

const TwoFASetup = () => {
  const [otpauthUrl, setOtpauthUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("http://localhost:5000/intra/generate-2fa-secret", {
        method: "GET",
        credentials: 'include'
      });

      if(response.ok) {
        const data = await response.json();
        setOtpauthUrl(data.otpauthUrl);
      } else {
        console.error("Error fetching 2FA secret:", response.status, response.statusText);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {otpauthUrl && (
        <QRCode value={otpauthUrl} />
      )}
    </div>
  );
};

export default TwoFASetup;
