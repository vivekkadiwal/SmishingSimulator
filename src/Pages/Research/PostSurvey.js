import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Style/Survey.css';
import { utils as XLSXUtils, write as writeXLSX } from 'xlsx';
import AWS from 'aws-sdk';
import { DemographicsRadioQuestionButton } from '../../Components/RadioButton';

const questionsData = [
  {
    question: 'After participating in our research/education session, how has your familiarity with the term "smishing" changed?',
    options: ["No change", "Slightly more familiar", "Moderately more familiar", "Significantly more familiar", "Extremely familiar"]
  },
  {
    question: 'How has your confidence in identifying potentially harmful messages (smishing, scams) changed after our session?',
    options: ["No change", "Slightly more confident", "Moderately more confident", "Significantly more confident", "Extremely confident"]
  },
  {
    question: 'Do you believe you are now better equipped to recognize a smishing attempt than before the session?',
    options: ["Yes", "No"]
  },
  {
    question: 'How easy or difficult did you find it to follow the content and instructions provided during the session and while completing this survey?',
    options: ["Very difficult", "Difficult", "Neutral", "Easy", "Very easy"]
  },
  {
    question: 'Do you feel more aware of the various forms phishing can take (email, phone call, social media) after our session?',
    options: ["Yes", "No"]
  },
  {
    question: 'Post-education, do you plan to use any specific techniques to verify the legitimacy of links or information received through messages?',
    options: ["Yes", "No"]
  },
  {
    question: 'Are you considering using any security software or apps on your phone because of the information provided during the session?',
    options: ["Yes", "No"]
  },
  {
    question: "Has the session influenced your intentions regarding how often you will update your phone's operating system and apps?",
    options: ["More likely", "No change", "Less likely"]
  },
  {
    question: "Based on the session's information, would you now be more cautious about clicking on links in text messages from unknown numbers?",
    options: ["Yes", "No"]
  },
  {
    question: 'After the session, how has your comfort level with sharing your personal information (address, phone number, etc.) through text messages changed?',
    options: ["less comfortable", "Slightly less comfortable", "No change", "Slightly more comfortable", "Very comfortable"]
  }
];


AWS.config.update({
  accessKeyId: 'AKIAZQ3DRHDX7IVE7WME',
  secretAccessKey: '',
  region: 'us-east-2',
});




const s3 = new AWS.S3();

const PostSurvey = () => {
  const [responses, setResponses] = useState(Array(questionsData.length).fill(0));
  const [participantId, setParticipantId] = useState('');
  const [validParticipantId, setValidParticipantId] = useState(true);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const { participantID } = useParams();

  useEffect(() => {
    setParticipantId(participantID);
    setValidParticipantId(!isNaN(participantID) && participantID.trim() !== '');
  }, [participantID]);

  useEffect(() => {
    setIsOptionSelected(responses[currentPage] !== 0);
  }, [responses, currentPage]);

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    if (!isOptionSelected) {
      alert('Please select at least one option.');
      return;
    }

    setButtonDisabled(true);
    setTimeout(() => {
      setCurrentPage(currentPage + 1);
      setButtonDisabled(false);
    }, 1000);
  };

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleSubmit = async (event) => {
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

    const workbook = XLSXUtils.book_new();
    const sheetName = 'PostSurvey';
    const data = [];
    questionsData.forEach((question, index) => {
      const responseIndex = responses[index] - 1;
      data.push([question.question, question.options[responseIndex]]);
    });
    const ws = XLSXUtils.aoa_to_sheet([['Question', 'Response'], ...data]);
    XLSXUtils.book_append_sheet(workbook, ws, sheetName);
    const excelBuffer = writeXLSX(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `PostSurvey_${participantId}.xlsx`;

    try {
      const subfolderName = `participant_${participantId}`;
      const uploadParams = {
        Bucket: 'cytra',
        Key: `survey-files/${subfolderName}/${fileName}`,
        Body: blob,
        ContentType: 'application/octet-stream',
      };

      const uploadResult = await s3.upload(uploadParams).promise();
      console.log('File uploaded successfully:', uploadResult.Location);

      if (currentPage === responses.length - 1) {
        navigate(`/instructions/systemusability-survey/${participantId}`);
      } else {
        setCurrentPage(currentPage + 1);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again later.');
    }
  };


  return (
    <div>
      <h1>Part 6 - Post Survey Questions</h1>
      {!validParticipantId && <p style={{ color: 'red' }}>Please enter a valid participant ID.</p>}
      <p>Participant ID: {participantId}</p>
      <div className='containerStyle'>
        <div className="question-border">
          <form onSubmit={handleSubmit}>
            <table className="survey-table">
              <thead>
                <tr>
                  <th>Questions</th>
                  <th className=' md:table-cell hidden md:w-80'>Response</th>
                </tr>
              </thead>
              <tbody>
                <tr className=' grid md:table-row'>
                  <td className='font-bold'>{questionsData[currentPage].question}</td>
                  <td>
                    {[...Array(questionsData[currentPage].options.length)].map((_, i) => (
                       <div key={i}>
                          <DemographicsRadioQuestionButton radioName={`question${currentPage + 1}`} radioValue={i + 1} checkedValue={responses[currentPage]} setRadioState={handleResponseChange} index={currentPage} itemID={i + 1} labelValue={questionsData[currentPage].options[i]} />
                       </div>
                    ))}
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            {currentPage > 0 && (
              <>
                <button type="button" onClick={handlePrev} className="rounded-green-button">
                  Previous
                </button>
                <span className="sm:ml-2"></span> {/* Add some space here */}
              </>
            )}
            {currentPage < responses.length - 1 ? (
              <>
                <span className="sm:ml-2"></span> {/* Add some space here */}
                <button type="button" onClick={handleNext} className="rounded-green-button" disabled={buttonDisabled}>
                  Next
                </button>
              </>
            ) : (
              <>
                <span className="sm:ml-2"></span> {/* Add some space here */}
                <button type="submit" className="rounded-green-button" onClick={handleSubmit}>
                  Submit
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostSurvey;
