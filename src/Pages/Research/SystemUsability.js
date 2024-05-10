import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Style/Survey.css';
import { utils as XLSXUtils, write as writeXLSX } from 'xlsx';
import AWS from 'aws-sdk';
import { DemographicsRadioQuestionButton } from '../../Components/RadioButton';

const s3 = new AWS.S3({
  accessKeyId: 'AKIAZQ3DRHDX7IVE7WME',
  secretAccessKey: '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',
  region: 'us-east-2'
});

const bucketName = 'cytra';
const folderName = 'survey-files';

const questionsData = [
  {
    question: 'I think that I would like to use this system frequently.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I found the system unnecessarily complex.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I thought the system was easy to use.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I think that I would need the support of a technical person to be able to use this system.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I found the various functions in this system were well integrated.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I thought there was too much inconsistency in this system.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I would imagine that most people would learn to use this system very quickly.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I found the system very awkward to use.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I felt very confident using the system.',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  },
  {
    question: 'I needed to learn a lot of things before I could get going with this system',
    options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"]
  }
];

const SystemUsability = () => {
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
    const sheetName = 'SystemUsability';
    const data = [];
    questionsData.forEach((question, index) => {
      const responseIndex = responses[index] - 1;
      data.push([question.question, question.options[responseIndex]]);
    });
    const ws = XLSXUtils.aoa_to_sheet([['Question', 'Response'], ...data]);
    XLSXUtils.book_append_sheet(workbook, ws, sheetName);
    const excelBuffer = writeXLSX(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `SystemUsability_${participantId}.xlsx`;

    const subfolderName = `participant_${participantId}`;
    const s3Params = {
      Bucket: bucketName,
      Key: folderName ? `${folderName}/${subfolderName}/${fileName}` : `${subfolderName}/${fileName}`,
      Body: blob,
      ContentType: 'application/octet-stream'
    };

    try {
      const uploadResult = await s3.upload(s3Params).promise();
      console.log('File uploaded successfully:', uploadResult.Location);

      navigate(`/`);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    }
  };


  return (
    <div>
      <h1>Part 7 - System Usability Questions</h1>
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

export default SystemUsability;