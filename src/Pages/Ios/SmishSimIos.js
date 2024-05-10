import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import { read, utils } from 'xlsx';
import html2canvas from 'html2canvas';
import '../Style/SmishSim.css';

const { sheet_to_json } = utils;

AWS.config.update({
  accessKeyId: 'AKIAZQ3DRHDX7IVE7WME',
  secretAccessKey: '',
  region: 'us-east-2'
});

const SmishSimIos = () => {
  const { participantID } = useParams();
  const navigate = useNavigate();

  const [excelData, setExcelData] = useState({});
  const [senderData, setSenderData] = useState([]);
  const [bodyData, setBodyData] = useState([]);
  const [urlData, setUrlData] = useState([]);
  const [formData, setFormData] = useState({
    message: '',
    selectedTemplate: '',
    selectedUrl: ''
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSender, setSelectedSender] = useState('');
  const [selectedContentBody, setSelectedContentBody] = useState('');
  const [selectedURL, setselectedURL] = useState('');
  const [imagesSaved, setImagesSaved] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  let senderColumnIndex = -1;
  let bodyColumnIndex = -1;
  let urlColumnIndex = -1;

  const getRandomValues = (data, count) => {
    const shuffled = data.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const s3 = new AWS.S3();
    const params = {
      Bucket: 'cytra',
      Key: 'analysisdataset_cs650.xlsx'
    };

    const data = await s3.getObject(params).promise();
    const workbook = read(data.Body, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    setCategories(sheetNames);
    setExcelData(workbook);
  };

  const handleCategoryChange = async (event) => {
    const selectedCategoryValue = event.target.value;
    setSelectedCategory(selectedCategoryValue);

    if (!selectedCategoryValue) {
      setShowWarning(true);
      return;
    }
    else {
      setShowWarning(false);
    }

    try {
      const s3 = new AWS.S3();
      const params = {
        Bucket: 'cytra',
        Key: 'analysisdataset_cs650.xlsx'
      };

      const data = await s3.getObject(params).promise();
      const workbook = read(data.Body, { type: 'buffer' });
      const sheet = workbook.Sheets[selectedCategoryValue];

      if (!sheet) {
        console.error('Sheet not found in Excel data.');
        return;
      }

      const parsedData = sheet_to_json(sheet, { header: 1 });
      senderColumnIndex = parsedData[0].indexOf('Sender');
      bodyColumnIndex = parsedData[0].indexOf('MainText');
      urlColumnIndex = parsedData[0].indexOf('Url');

      if (senderColumnIndex !== -1 && bodyColumnIndex !== -1 && urlColumnIndex !== -1) {
        const senders = getRandomValues(parsedData.slice(1).map(row => row[senderColumnIndex]), 3);
        const bodies = getRandomValues(parsedData.slice(1).map(row => row[bodyColumnIndex]), 3);
        const urls = getRandomValues(parsedData.slice(1).map(row => row[urlColumnIndex]), 3);

        setSenderData(senders);
        setBodyData(bodies);
        setUrlData(urls);
        setExcelData(parsedData);
      } else {
        console.error('Required columns not found in Excel data.');
      }
    } catch (error) {
      console.error('Error fetching Excel file:', error);
    }
  };

  const handleSenderChange = async (event) => {
    const sender = event.target.value;
    setSelectedSender(sender);
    setFormData({ ...formData, sender });
  };

  const handleTemplateChange = (event) => {
    const selectedTemplate = event.target.value;
    setSelectedContentBody(selectedTemplate);
    setFormData({ ...formData, selectedTemplate });
  };

  const handleUrlChange = async (event) => {
    const selectedUrl = event.target.value;
    setselectedURL(selectedUrl);
    setFormData({ ...formData, selectedUrl });
  };

  const saveAsImage = () => {
    const messagePreview = document.querySelector('.message-preview');
    html2canvas(messagePreview).then(canvas => {
      setImagesSaved(prev => prev + 1);
    });

    setFormData({ message: '', selectedTemplate: '', selectedUrl: '' });
    setShowWarning(false);
  };

  const handleNextClick = () => {
    if (formData.sender && formData.selectedTemplate && formData.selectedUrl) {
      saveAsImage();

      // const senders = getRandomValues(excelData.slice(1).map(row => row[senderColumnIndex]), 3);
      // const bodies = getRandomValues(excelData.slice(1).map(row => row[bodyColumnIndex]), 3);
      // const urls = getRandomValues(excelData.slice(1).map(row => row[urlColumnIndex]), 3);
      setSelectedContentBody("");
      setSelectedCategory("");
      setSelectedSender("");
      setselectedURL("");
      // setSenderData(senders);
      // setBodyData(bodies);
      // setUrlData(urls);
      setImagesSaved(0);
      setClickCount(prev => prev + 1);

      if (clickCount + 1 === 10) {
        navigate(`/instructions/post-training-ios/${participantID}`);
      }
    } else {
      setShowWarning(true);
    }
  };

  useEffect(() => {
    if (imagesSaved === 10) {
      navigate(`/instructions/post-training-android/${participantID}`);
    }
  }, [imagesSaved, navigate, participantID, clickCount]);


  return (
    <div>
      <h1>Part 4 - Smishing Simulator Tasks</h1>
      <p>Participant ID: {participantID}</p>
      <p>You have created {clickCount} / 10 phishing SMS so far.</p>
      <div className="containerStyle">
        <div className='block md:flex md:flex-row mx-auto'>
          <div className="md:grow">
            <h2>Smishing Simulator</h2>
            <div className='w-full md:w-11/12 mx-auto'>
              <h4 className='text-left'>Instructions:</h4>
              <ol className=" list-decimal list-inside text-left">
                {/* <li>In the next section, your task is to classify whether SMS messages are Real or Fake.</li> */}
                <li className=' md:pl-4'>A variety of brands, sender numbers, message scenarios, and URLs are used by attackers in SMS phishin attacks. </li>
                <li className=' md:pl-4'>In the upcoming task, we request that you take on the perspective of a scammer and generate 10 SMS phishing messages. </li>
                <li className=' md:pl-4'>Please select category, sender, message body, and URLs for the SMS message in the specified order. </li>
                <li className='font-extrabold md:pl-4'>Please <span className='font-extrabold text-red-700'>DO NOT</span> attempt to send and SMS to the number mentioned in the message.</li>
                <li className='font-extrabold md:pl-4'>Please <span className=' text-red-700'>DO NOT</span> attempt to visit any links mentioned in the messages.</li>
              </ol>
            </div>
            <hr className=' my-2' />
            <div className="category-selection">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h3>Select Category:</h3>
                <select value={selectedCategory} onChange={handleCategoryChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                  <option data-content value="">Select...</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </select>
                {showWarning && <p className=" text-red-500 font-semibold">Please select a category before fetching data.</p>}

              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3>Select Sender:</h3>
              <select value={selectedSender} onChange={handleSenderChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option value="">Select...</option>
                {senderData.map((sender, index) => (
                  <option key={index} value={sender}>{sender}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3>Select Message Body:</h3>
              <select value={selectedContentBody} onChange={handleTemplateChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-00 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option className='  border-b border-solid border-gray-800 whitespace-normal' value="">Select...</option>
                {bodyData.map((template, index) => (
                  <option key={index} value={template}>{template.length > 35 ? template.substring(0, 35) + '...' : template}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3>Select URL:</h3>
              <select value={selectedURL} onChange={handleUrlChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-00 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option className='  border-b border-solid border-gray-800 whitespace-normal' value="">Select...</option>
                {urlData.map((url, index) => (
                  <option key={index} value={url}>{url.length > 35 ? url.substring(0, 35) + '...' : url}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <h2>Message Preview</h2>
            <div className=' inline-block'>
              <div className="bg-gray-100 rounded-lg px-4 py-4 w-[275px] h-[500px] md:w-[300px] md:h-[525px] lg:w-[350px] lg:h-[600px] overflow-hidden relative flex items-center justify-center border border-black">
                <div className="phone-frame">
                  <div className="message-preview">
                    <div className="message-container">
                      <div className="sender">{formData.sender || 'Unknown Sender'}</div>
                      <div className="message user-message">
                        {formData.selectedTemplate || 'Your message will appear here.'}
                        <span className=' text-blue-700 underline'>{formData.selectedUrl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showWarning && <p className=" text-red-500 font-semibold">Please select all options before proceeding.</p>}
      <button className="save-btn" onClick={handleNextClick}>Next</button>
    </div>
  );
};

export default SmishSimIos;
