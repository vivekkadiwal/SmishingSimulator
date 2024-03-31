import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [participantID, setParticipantID] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    const id = parseInt(participantID);
    if ((id >= 1 && id <= 60) || id === 100 || id === 101 || id === 102) {
      navigate(`/pre-survey/${participantID}`);
    } else {
      alert('Please enter a valid participant ID within the range of 1 to 60.');
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setParticipantID(value);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="participantID">Participant ID:</label>
        <input
          type="text"
          id="participantID"
          value={participantID}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;