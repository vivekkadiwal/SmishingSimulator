import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../Style/Survey.css';
import { utils as XLSXUtils, write as writeXLSX } from 'xlsx';
import AWS from 'aws-sdk';
import { ImgRadioQuestionButton } from '../../Components/RadioButton';

const s3 = new AWS.S3({
  accessKeyId: 'AKIAZQ3DRHDX7IVE7WME',
  secretAccessKey: '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',
  region: 'us-east-2'
});

const bucketName = 'cytra';
const folderName = 'survey-files';

const PreTraining = () => {
  const [responses, setResponses] = useState(Array(10).fill(null).map(() => ({ imageId: '', response: null })));
  const [participantId, setParticipantId] = useState('');
  const [imageData, setImageData] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [warnBeforeUnload, setWarnBeforeUnload] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const navigate = useNavigate();
  const { participantID } = useParams();

  useEffect(() => {
    setParticipantId(participantID);

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

  useEffect(() => {
    async function fetchImages() {
      try {
        const fetchedImageData = [];
        const imageIds = new Set();

        const bucketUrl = 'https://cytra.s3.us-east-2.amazonaws.com/Android/d';

        while (fetchedImageData.length < 10) {
          const randomId = Math.floor(Math.random() * 15) + 1;

          if (!imageIds.has(randomId)) {
            imageIds.add(randomId);


            const imageUrl = `${bucketUrl}${randomId}.jfif`;
            fetchedImageData.push({ id: randomId, url: imageUrl });
          }
        }

        setImageData(fetchedImageData);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    fetchImages();
  }, []);

  useEffect(() => {
    setIsOptionSelected(responses[currentPage].response !== null);
  }, [responses, currentPage]);

  const handleResponseChange = (index, imageId, value) => {
    const newResponses = [...responses];
    newResponses[index] = { imageId, response: value };
    setResponses(newResponses);
    setWarnBeforeUnload(true);
  };

  const handleNext = () => {
    if (!isOptionSelected) {
      alert('Please select at least one option.');
      return;
    }
    setCurrentPage(currentPage + 1);
    setButtonDisabled(true);
    setTimeout(() => {
      setButtonDisabled(false);
    }, 1000);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const unanswered = responses.reduce((acc, response, index) => {
      if (response.response === null) {
        acc.push(index + 1);
      }
      return acc;
    }, []);

    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
    } else {
      const workbook = XLSXUtils.book_new();
      const sheetName = 'PreTrainingResponsesAndroid';
      const data = [];
      imageData.forEach((item, index) => {
        data.push([`Question ${index + 1}`, responses[index].imageId, responses[index].response === 0 ? 'Real' : 'Fake']);
      });
      const ws = XLSXUtils.aoa_to_sheet([['Question Number', 'Image ID', 'Response'], ...data]);
      XLSXUtils.book_append_sheet(workbook, ws, sheetName);
      const excelBuffer = writeXLSX(workbook, { bookType: 'xlsx', type: 'array' });

      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const fileName = `PreTrainingResponsesAndroid_${participantId}.xlsx`;

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

        setResponses(Array(10).fill(null).map(() => ({ imageId: '', response: null })));
        navigate(`/instructions/smish-sim-android/${participantID}`);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Error uploading file. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Part 3</h1>
      <p>Participant ID: {participantId}</p>
      <form onSubmit={handleSubmit}>
        {imageData.map((item, index) => (
          <div key={index} className={`containerStyle ${unansweredQuestions.includes(index + 1) ? 'unanswered' : ''}`} style={{ display: index === currentPage ? 'block' : 'none' }}>
            <div className="question-border">
              <p>Question {index + 1}: Do you think the following screenshot is a real SMS?</p>
              <hr className="line" />
              <div className='flex justify-center items-center'>
                <img
                  src={item.url}
                  alt={`${index + 1}`}
                  style={{ maxWidth: '280px', maxHeight: '500px' }}
                />
              </div>
              <hr className="line" />
              <ImgRadioQuestionButton radioName={`question${index + 1}`} radioValue="0" checkedValue={responses[index].response} setRadioState={handleResponseChange} index={index} itemID={item.id} labelValue="Real" />
              <ImgRadioQuestionButton radioName={`question${index + 1}`} radioValue="2" checkedValue={responses[index].response} setRadioState={handleResponseChange} index={index} itemID={item.id} labelValue="Fake" />
            </div>
          </div>
        ))}
        {currentPage < imageData.length - 1 && (
          <button type="button" onClick={handleNext} className="rounded-green-button" disabled={buttonDisabled}>
            Next
          </button>
        )}
        {currentPage === imageData.length - 1 && (
          <button type="submit" className="rounded-green-button" disabled={buttonDisabled}>
            Submit & Next Section
          </button>
        )}
      </form>
    </div>
  );
};

export default PreTraining;