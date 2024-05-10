import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [participantID, setParticipantID] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const id = parseInt(participantID);
    if ((id >= 1 && id <= 9999) || id === 100 || id === 101 || id === 102) {
      navigate(`/instructions/demographic-survey/${participantID}`);
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
    <div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div>
        <h2 style={{ textAlign: 'center' }}>Please enter the Participant ID that you got from the Qualtrics below :</h2>
        <div style={{ textAlign: 'center' }}>
          <form onSubmit={handleSubmit}>

              <label htmlFor="participantID" className="mb-2 text-lg font-medium text-gray-900 dark:text-white pr-2">ParticipantID</label>
              <input type="text"
                id="participantID"
                value={participantID}
                onChange={handleInputChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder=""
                required
              />
 
            {/* <label htmlFor="participantID">Participant ID:</label>
            <input
              type="text"
              id="participantID"
              value={participantID}
              onChange={handleInputChange}
              required
            /> */}
            <button type="submit">Next</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;