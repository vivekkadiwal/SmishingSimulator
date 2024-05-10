import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { utils as XLSXUtils, write as writeXLSX } from 'xlsx';
import AWS from 'aws-sdk';
import { DemographicsRadioQuestionButton } from '../../Components/RadioButton';

const s3 = new AWS.S3({
  accessKeyId: 'AKIAZQ3DRHDX7IVE7WME',
  secretAccessKey: 'N6kmBbLK6DHPICi2KV9Aktj8Dus6Ic0TnSOhT7Rj',
  region: 'us-east-2'
});

const questionsData = [
  {
    question: 'What is your sex assigned at birth?',
    options: ['Male', 'Female', 'Intersex', 'Prefer not to answer']
  },
  {
    question: 'Which category below includes your age?',
    options: [
      '18 - 24',
      '25 - 34',
      '35 - 44',
      '45 - 54',
      '55 - 64',
      '65 or older',
      'Prefer not to answer'
    ]
  },
  {
    question: 'What is the highest degree or level of school that you have completed?',
    options: [
      'Less than a high school degree',
      'High school graduate',
      'Some college but no degree',
      'Associate degree',
      'Bachelor degree',
      'Master degree',
      'Doctoral degree',
      'Professional degree',
      'Prefer not to answer'
    ]
  },
  {
    question: 'What is your race?',
    options: [
      'Asian',
      'Black or African American',
      'Latino',
      'Mixed or biracial',
      'Native American or Alaska Native',
      'Pacific Islander',
      'White',
      'Prefer not to answer'
    ]
  },
  {
    question: 'Please estimate what your total household income will be for this year:',
    options: [
      'Less than $10,000',
      '$10,000 - $19,999',
      '$20,000 - $39,999',
      '$40,000 - $59,999',
      '$60,000 - $79,999',
      '$80,000 - $99,999',
      '$100,000 or more',
      'Prefer not to answer'
    ]
  },
  {
    question: 'What is your current employment status?',
    options: [
      'Employed, working full-time (40 or more hours per week)',
      'Employed, working part-time (less than 40 hours per week)',
      'Self-employed (including freelance work)',
      'Unemployed and currently looking for work',
      'Unemployed and not currently looking for work',
      'College student',
      'Undergraduate student',
      'Graduate student',
      'Retired',
      'Unable to work (due to disability, health issues, etc.)',
      'Homemaker',
      'Prefer not to answer'
    ]
  },
];

const Demographics = () => {
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

    if (!isOptionSelected) {
      alert('Please select at least one option.');
      return;
    }

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
    const sheetName = 'Demographics';
    const data = [];
    questionsData.forEach((question, index) => {
      const responseIndex = responses[index] - 1;
      data.push([question.question, question.options[responseIndex]]);
    });
    const ws = XLSXUtils.aoa_to_sheet([['Question', 'Response'], ...data]);
    XLSXUtils.book_append_sheet(workbook, ws, sheetName);
    const excelBuffer = writeXLSX(workbook, { bookType: 'xlsx', type: 'array' });

    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const subfolderName = `participant_${participantId}`;
    const params = {
      Bucket: 'cytra/survey-files',
      Key: `${subfolderName}/Demographics_${participantId}.xlsx`,
      Body: excelBlob,
      ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ACL: 'public-read'
    };

    try {
      const data = await s3.upload(params).promise();
      console.log('File uploaded successfully:', data.Location);
    } catch (error) {
      console.error('Error uploading file:', error);
    }

    if (currentPage === responses.length - 1) {
      navigate(`/instructions/pre-survey/${participantID}`);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };



  return (
    <div>
      <h1>Part 1 - Demographics Questions</h1>
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
                <button type="button" onClick={handleNext} className="rounded-green-button">
                  Next
                </button>
              </>
            ) : (
              <>
                <span className="sm:ml-2"></span> {/* Add some space here */}
                <button type="submit" className="rounded-green-button">
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

export default Demographics;