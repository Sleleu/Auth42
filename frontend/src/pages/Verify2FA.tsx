import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

const Verify2FA: React.FC = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios.get(
        "http://localhost:5000/intra/verify-2fa-code",
        { params: { code } }
      );

      setMessage(response.data.message);
      setError(null);
    } catch (error) {
      setError("Invalid 2FA code.");
      setMessage(null);
    }
  };

  return (
    <div>
      <h1>Verify 2FA</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your 2FA code:
          <input type="text" onChange={handleInputChange} value={code} />
        </label>
        <button type="submit">Verify</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
}

export default Verify2FA;
