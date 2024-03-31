// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import './Survey.css';
// import * as XLSX from 'xlsx';

// const PreTraining = () => {
//   const [responses, setResponses] = useState(Array(10).fill(null));
//   const [participantId, setParticipantId] = useState('');
//   const [imageData, setImageData] = useState([]);
//   const [unansweredQuestions, setUnansweredQuestions] = useState([]);
//   const [warnBeforeUnload, setWarnBeforeUnload] = useState(false); 

//   const navigate = useNavigate();
//   const { participantID } = useParams();

//   useEffect(() => {
//     setParticipantId(participantID);


//     const handleBeforeUnload = (event) => {
//       if (warnBeforeUnload) {
//         event.returnValue = 'Are you sure you want to leave? Your changes may not be saved.';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [participantID, warnBeforeUnload]);

//   useEffect(() => {
//     async function fetchImages() {
//       try {
//         const fetchedImageData = [];
//         const imageIds = new Set();

//         while (fetchedImageData.length < 10) {
//           const randomId = Math.floor(Math.random() * 2335) + 1;

//           if (!imageIds.has(randomId)) {
//             imageIds.add(randomId);

//             const url = `https://smishtank-direct-upload-s3.s3.us-west-1.amazonaws.com/images/${randomId}`;
//             const response = await fetch(url);

//             if (response.ok) {
//               const data = await response.blob();
//               const imageUrl = URL.createObjectURL(data);
//               fetchedImageData.push({ id: randomId, url: imageUrl });
//             } else {
//               console.error(`Failed to fetch image with ID ${randomId}`);
//             }
//           }
//         }

//         setImageData(fetchedImageData);
//       } catch (error) {
//         console.error('Error fetching images:', error);
//       }
//     }

//     fetchImages();
//   }, [participantID]);

//   const handleResponseChange = (index, value) => {
//     const newResponses = [...responses];
//     newResponses[index] = value;
//     setResponses(newResponses);
//     setWarnBeforeUnload(true); 
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const unanswered = responses.reduce((acc, response, index) => {
//       if (response === null) {
//         acc.push(index + 1);
//       }
//       return acc;
//     }, []);

//     if (unanswered.length > 0) {
//       setUnansweredQuestions(unanswered);
//     } else {
//       const data = [['Image ID', 'Image URL', 'Question', 'Response']];
//       imageData.forEach((item, index) => {
//         const response = responses[index];
//         const responseText = response === 0 ? 'Real' : response === 1 ? 'Maybe' : 'Fake';
//         data.push([item.id, item.url, `Question ${index + 1}`, responseText]);
//       });

//       console.log('Data to be written to file:', data);

//       const ws = XLSX.utils.aoa_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');

//       const fileName = participantId ? `PreTraining_${participantId}.xlsx` : 'survey_responses.xlsx';

//       try {
//         XLSX.writeFile(wb, fileName);
//         setResponses(Array(10).fill(null));

        
//         if ((parseInt(participantId) >= 1 && parseInt(participantId) <= 20) || participantId === '100') {
//           navigate(`/smish-sim/${participantId}`);
//         } else if ((parseInt(participantId) >= 21 && parseInt(participantId) <= 40) || participantId === '101') {
//           navigate(`/youtube-train/${participantId}`);
//         } else if ((parseInt(participantId) >= 41 && parseInt(participantId) <= 60) || participantId === '102') {
//           navigate(`/post-survey/${participantId}`);
//         } else {
//           console.error('Participant ID out of range:', participantId);
//         }
        
//       } catch (error) {
//         console.error('Error writing file:', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Pre Training Tasks</h2>
//       <p>Participant ID: {participantId}</p>
//       <form onSubmit={handleSubmit}>
//         {imageData.map((item, index) => (
//           <div key={index} className={`question-container ${unansweredQuestions.includes(index + 1) ? 'unanswered' : ''}`}>
//             <div className="question-border">
//               <p>Question {index + 1}:</p>
//               <hr className="line" />
//               <img
//                 src={item.url}
//                 alt={`Image ${index + 1}`}
//                 style={{ maxWidth: '300px', maxHeight: '500px' }}
//               />
//               <hr className="line" />
//               <div>
//                 <label>
//                   <input
//                     type="radio"
//                     name={`question${index + 1}`}
//                     value={0}
//                     checked={responses[index] === 0}
//                     onChange={() => handleResponseChange(index, 0)}
//                   />
//                   Real
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name={`question${index + 1}`}
//                     value={1}
//                     checked={responses[index] === 1}
//                     onChange={() => handleResponseChange(index, 1)}
//                   />
//                   Maybe
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name={`question${index + 1}`}
//                     value={2}
//                     checked={responses[index] === 2}
//                     onChange={() => handleResponseChange(index, 2)}
//                   />
//                   Fake
//                 </label>
//               </div>
//             </div>
//           </div>
//         ))}
//         {unansweredQuestions.length > 0 && (
//           <p className="error-message">Please answer all questions before submitting.</p>
//         )}
//         <button type="submit" className="rounded-green-button">
//           Submit & Next
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PreTraining;

// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import './Survey.css';
// import * as XLSX from 'xlsx';

// const PreTraining = () => {
//   const [responses, setResponses] = useState(Array(10).fill(null));
//   const [participantId, setParticipantId] = useState('');
//   const [imageData, setImageData] = useState([]);
//   const [unansweredQuestions, setUnansweredQuestions] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0); // Track current page
//   const [warnBeforeUnload, setWarnBeforeUnload] = useState(false);

//   const navigate = useNavigate();
//   const { participantID } = useParams();

//   useEffect(() => {
//     setParticipantId(participantID);

//     const handleBeforeUnload = (event) => {
//       if (warnBeforeUnload) {
//         event.returnValue = 'Are you sure you want to leave? Your changes may not be saved.';
//       }
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//     };
//   }, [participantID, warnBeforeUnload]);

//   useEffect(() => {
//     async function fetchImages() {
//       try {
//         const fetchedImageData = [];
//         const imageIds = new Set();

//         while (fetchedImageData.length < 10) {
//           const randomId = Math.floor(Math.random() * 2335) + 1;

//           if (!imageIds.has(randomId)) {
//             imageIds.add(randomId);

//             const url = `https://smishtank-direct-upload-s3.s3.us-west-1.amazonaws.com/images/${randomId}`;
//             const response = await fetch(url);

//             if (response.ok) {
//               const data = await response.blob();
//               const imageUrl = URL.createObjectURL(data);
//               fetchedImageData.push({ id: randomId, url: imageUrl });
//             } else {
//               console.error(`Failed to fetch image with ID ${randomId}`);
//             }
//           }
//         }

//         setImageData(fetchedImageData);
//       } catch (error) {
//         console.error('Error fetching images:', error);
//       }
//     }

//     fetchImages();
//   }, [participantID]);

//   const handleResponseChange = (index, value) => {
//     const newResponses = [...responses];
//     newResponses[index] = value;
//     setResponses(newResponses);
//     setWarnBeforeUnload(true);
//   };

//   const handleNext = () => {
//     setCurrentPage(currentPage + 1);
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     const unanswered = responses.reduce((acc, response, index) => {
//       if (response === null) {
//         acc.push(index + 1);
//       }
//       return acc;
//     }, []);

//     if (unanswered.length > 0) {
//       setUnansweredQuestions(unanswered);
//     } else {
//       const data = [['Image ID', 'Image URL', 'Question', 'Response']];
//       imageData.forEach((item, index) => {
//         const response = responses[index];
//         const responseText = response === 0 ? 'Real' : response === 1 ? 'Maybe' : 'Fake';
//         data.push([item.id, item.url, `Question ${index + 1}`, responseText]);
//       });

//       console.log('Data to be written to file:', data);

//       const ws = XLSX.utils.aoa_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');

//       const fileName = participantId ? `PreTraining_${participantId}.xlsx` : 'survey_responses.xlsx';

//       try {
//         XLSX.writeFile(wb, fileName);
//         setResponses(Array(10).fill(null));

//         if ((parseInt(participantId) >= 1 && parseInt(participantId) <= 20) || participantId === '100') {
//           navigate(`/smish-sim/${participantId}`);
//         } else if ((parseInt(participantId) >= 21 && parseInt(participantId) <= 40) || participantId === '101') {
//           navigate(`/youtube-train/${participantId}`);
//         } else if ((parseInt(participantId) >= 41 && parseInt(participantId) <= 60) || participantId === '102') {
//           navigate(`/post-survey/${participantId}`);
//         } else {
//           console.error('Participant ID out of range:', participantId);
//         }

//       } catch (error) {
//         console.error('Error writing file:', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <h2>Pre Training Tasks</h2>
//       <p>Participant ID: {participantId}</p>
//       <form onSubmit={handleSubmit}>
//         {imageData.map((item, index) => (
//           <div key={index} className={`question-container ${unansweredQuestions.includes(index + 1) ? 'unanswered' : ''}`} style={{ display: index === currentPage ? 'block' : 'none' }}>
//             <div className="question-border">
//               <p>Question {index + 1}:</p>
//               <hr className="line" />
//               <img
//                 src={item.url}
//                 alt={`Image ${index + 1}`}
//                 style={{ maxWidth: '300px', maxHeight: '500px' }}
//               />
//               <hr className="line" />
//               <div>
//                 <label>
//                   <input
//                     type="radio"
//                     name={`question${index + 1}`}
//                     value={0}
//                     checked={responses[index] === 0}
//                     onChange={() => handleResponseChange(index, 0)}
//                   />
//                   Real
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name={`question${index + 1}`}
//                     value={1}
//                     checked={responses[index] === 1}
//                     onChange={() => handleResponseChange(index, 1)}
//                   />
//                   Maybe
//                 </label>
//                 <label>
//                   <input
//                     type="radio"
//                     name={`question${index + 1}`}
//                     value={2}
//                     checked={responses[index] === 2}
//                     onChange={() => handleResponseChange(index, 2)}
//                   />
//                   Fake
//                 </label>
//               </div>
//             </div>
//           </div>
//         ))}
//         {unansweredQuestions.length > 0 && (
//           <p className="error-message">Please answer all questions before submitting.</p>
//         )}
//         {currentPage < imageData.length - 1 && (
//           <button type="button" onClick={handleNext} className="rounded-green-button">
//             Next
//           </button>
//         )}
//         {currentPage === imageData.length - 1 && (
//           <button type="submit" className="rounded-green-button">
//             Submit & Next Section
//           </button>
//         )}
//       </form>
//     </div>
//   );
// };

// export default PreTraining;

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Survey.css';
import * as XLSX from 'xlsx';

const PostTraining = () => {
  const [responses, setResponses] = useState(Array(10).fill(null));
  const [participantId, setParticipantId] = useState('');
  const [imageData, setImageData] = useState([]);
  const [unansweredQuestions, setUnansweredQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [warnBeforeUnload, setWarnBeforeUnload] = useState(false);
  const [isOptionSelected, setIsOptionSelected] = useState(false); 

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

        while (fetchedImageData.length < 10) {
          const randomId = Math.floor(Math.random() * 2335) + 1;

          if (!imageIds.has(randomId)) {
            imageIds.add(randomId);

            const url = `https://smishtank-direct-upload-s3.s3.us-west-1.amazonaws.com/images/${randomId}`;
            const response = await fetch(url);

            if (response.ok) {
              const data = await response.blob();
              const imageUrl = URL.createObjectURL(data);
              fetchedImageData.push({ id: randomId, url: imageUrl });
            } else {
              console.error(`Failed to fetch image with ID ${randomId}`);
            }
          }
        }

        setImageData(fetchedImageData);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    fetchImages();
  }, [participantID]);

  useEffect(() => {
    setIsOptionSelected(responses[currentPage] !== null);
  }, [responses, currentPage]);

  const handleResponseChange = (index, value) => {
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
    setWarnBeforeUnload(true);
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const unanswered = responses.reduce((acc, response, index) => {
      if (response === null) {
        acc.push(index + 1);
      }
      return acc;
    }, []);

    if (unanswered.length > 0) {
      setUnansweredQuestions(unanswered);
    } else {
      const data = [['Image ID', 'Image URL', 'Question', 'Response']];
      imageData.forEach((item, index) => {
        const response = responses[index];
        const responseText = response === 0 ? 'Real' : response === 1 ? 'Maybe' : 'Fake';
        data.push([item.id, item.url, `Question ${index + 1}`, responseText]);
      });

      console.log('Data to be written to file:', data);

      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Survey Responses');

      const fileName = participantId ? `PostTraining_${participantId}.xlsx` : 'survey_responses.xlsx';

      try {
        XLSX.writeFile(wb, fileName);
        setResponses(Array(10).fill(null));

        if ((parseInt(participantId) >= 1 && parseInt(participantId) <= 20) || participantId === '100') {
          navigate(`/post-survey/${participantId}`);
        } else if ((parseInt(participantId) >= 21 && parseInt(participantId) <= 40) || participantId === '101') {
          navigate(`/post-survey/${participantId}`);
        } else if ((parseInt(participantId) >= 41 && parseInt(participantId) <= 60) || participantId === '102') {
          navigate(`/post-survey/${participantId}`);
        } else {
          console.error('Participant ID out of range:', participantId);
        }

      } catch (error) {
        console.error('Error writing file:', error);
      }
    }
  };

  return (
    <div>
      <h2>Post Training Tasks</h2>
      <p>Participant ID: {participantId}</p>
      <form onSubmit={handleSubmit}>
        {imageData.map((item, index) => (
          <div key={index} className={`question-container ${unansweredQuestions.includes(index + 1) ? 'unanswered' : ''}`} style={{ display: index === currentPage ? 'block' : 'none' }}>
            <div className="question-border">
              <p>Question {index + 1}:</p>
              <hr className="line" />
              <img
                src={item.url}
                alt={`${index + 1}`}
                style={{ maxWidth: '300px', maxHeight: '500px' }}
              />
              <hr className="line" />
              <div>
                <label>
                  <input
                    type="radio"
                    name={`question${index + 1}`}
                    value={0}
                    checked={responses[index] === 0}
                    onChange={() => handleResponseChange(index, 0)}
                  />
                  Real
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question${index + 1}`}
                    value={1}
                    checked={responses[index] === 1}
                    onChange={() => handleResponseChange(index, 1)}
                  />
                  Maybe
                </label>
                <label>
                  <input
                    type="radio"
                    name={`question${index + 1}`}
                    value={2}
                    checked={responses[index] === 2}
                    onChange={() => handleResponseChange(index, 2)}
                  />
                  Fake
                </label>
              </div>
            </div>
          </div>
        ))}
        {unansweredQuestions.length > 0 && (
          <p className="error-message">Please answer all questions before submitting.</p>
        )}
        {currentPage < imageData.length - 1 && (
          <button type="button" onClick={handleNext} className="rounded-green-button" disabled={!isOptionSelected}>
            Next
          </button>
        )}
        {currentPage === imageData.length - 1 && (
          <button type="submit" className="rounded-green-button" disabled={!isOptionSelected}>
            Submit & Next Section
          </button>
        )}
      </form>
    </div>
  );
};

export default PostTraining;
