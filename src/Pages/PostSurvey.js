import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Survey.css';
import * as XLSX from 'xlsx';

const PostSurvey = () => {
  const [responses, setResponses] = useState(Array(2).fill(0)); // Modify number of questions
  const [participantId, setParticipantId] = useState('');
  const [validParticipantId, setValidParticipantId] = useState(true); 
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [warnBeforeUnload, setWarnBeforeUnload] = useState(false); // Track if warning is needed

  const navigate = useNavigate();
  const { participantID } = useParams();

  useEffect(() => {
    setParticipantId(participantID);
    setValidParticipantId(!isNaN(participantID) && participantID.trim() !== ''); 
    const handleBeforeUnload = (event) => {
      if (warnBeforeUnload) {
        event.returnValue = 'Are you sure you want to leave? Your changes may not be saved.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [participantID, warnBeforeUnload]);

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
    setWarnBeforeUnload(true); 
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validParticipantId) {
      alert('Please enter a valid participant ID.');
      return;
    }

    const unanswered = [];
    for (let i = 0; i < responses.length; i++) {
      if (responses[i] === 0) {
        unanswered.push(i);
      }
    }

    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
      return;
    }

    const data = [
      ['Question', 'Response'],
      ...responses.map((response, index) => [`Question ${index + 1}`, response]),
    ];

    console.log('Data to be written to file:', data);

    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');

    const fileName = participantId ? `PostSurv_${participantId}.xlsx` : 'survey_responses.xlsx';

    try {
      XLSX.writeFile(wb, fileName);
      setResponses(Array(2).fill(0));
      setUnansweredQuestions([]);
      setWarnBeforeUnload(false);
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };

  return (
    <div>
      <h2>Post Survey Questions</h2>
      {!validParticipantId && <p style={{ color: 'red' }}>Please enter a valid participant ID.</p>}
      <p>Participant ID: {participantId}</p>
      <form onSubmit={handleSubmit}>
        <table className="survey-table">
          <thead>
            <tr>
              <th>Questions</th>
              <th>Response</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((response, index) => (
              <tr key={index}>
                <td>{`Question ${index + 1} Placeholder`}</td>
                <td>
                  {[...Array(5)].map((_, i) => (
                    <label key={i} style={{ border: unansweredQuestions.includes(index) ? '1px solid red' : 'none' }}>
                      <input
                        type="radio"
                        name={`question${index + 1}`}
                        value={i + 1}
                        checked={responses[index] === i + 1}
                        onChange={() => handleResponseChange(index, i + 1)}
                      />
                      {i + 1}
                    </label>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button type="submit" className="rounded-green-button">
          Submit & Next
        </button>
      </form>
    </div>
  );
};

export default PostSurvey;