import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AWS from 'aws-sdk';
import { read, utils } from 'xlsx';
import html2canvas from 'html2canvas';
import '../Style/SmishSim.css';

const { sheet_to_json } = utils;

AWS.config.update({
  accessKeyId: 'AKIAZQ3DRHDX7IVE7WME',
  secretAccessKey: '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',
  region: 'us-east-2'
});

const SmishSimAndroid = () => {
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
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  let senderColumnIndex = 1;
  let bodyColumnIndex = 3;
  let urlColumnIndex = 4;
  let brandColumnIndex = 2;

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

    const sheet = workbook.Sheets[sheetNames[0]];
    const parsedData = sheet_to_json(sheet, { header: 1 });
    brandColumnIndex = parsedData[0].indexOf('Brand');
    if (brandColumnIndex !== -1) {
      const brands = new Set(parsedData.slice(1).map(row => row[brandColumnIndex]));
      setBrands(['Select Brand', ...brands]);
    }
  };

  const handleCategoryChange = async (event) => {
    const selectedCategoryValue = event.target.value;
    setSelectedCategory(selectedCategoryValue);
  
    if (!selectedCategoryValue) {
      setShowWarning(true);
      return;
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
  
      if (brandColumnIndex !== -1 && senderColumnIndex !== -1) {
        const filteredData = parsedData.slice(1).filter(row => row[2] === selectedBrand);
        const senders = ['Select Sender', ...new Set(filteredData.map(row => row[1]))];
        setSenderData(senders);
      } else {
        console.error('Required columns not found in Excel data.');
      }
  
      // Update brands state with unique values from "Brand" column
      const brands = new Set(parsedData.slice(1).map(row => row[2]));
      setBrands(['Select Brand', ...brands]);
  
      // Reset selected brand when category changes
      setSelectedBrand('');
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
  

  const handleBrandChange = (event) => {
    const selectedBrand = event.target.value;
    setSelectedBrand(selectedBrand);
  
    if (excelData[selectedCategory]) {
      const sheetData = excelData[selectedCategory];
      const filteredSenders = sheetData.slice(1)
        .filter(row => row[brandColumnIndex] === selectedBrand)
        .map(row => row[senderColumnIndex]);
      setSenderData(['Select Sender', ...new Set(filteredSenders)]);
    }
  };
  
  

  const saveAsImage = () => {
    const messagePreview = document.querySelector('.message-preview');
    html2canvas(messagePreview).then(canvas => {
      setImagesSaved(prev => prev + 1);
    });

    setFormData({ message: '', selectedTemplate: '', selectedUrl: '' });
    setShowWarning(false);
  };

  const handleNextClick = async () => {
    if (formData.sender && formData.selectedTemplate && formData.selectedUrl) {
      const selectedSender = formData.sender;
      const selectedBody = formData.selectedTemplate;
      const selectedUrl = formData.selectedUrl;

      const textBody = `${selectedBody} ${selectedUrl}`;

      const jsonData = {
        index: clickCount + 1,
        name: selectedSender,
        text_body: textBody
      };


      const s3Params = {
        Bucket: 'cytra',
        Key: `survey-files/participant_${participantID}/smish_android_${participantID}_${clickCount + 1}.json`,
        Body: JSON.stringify(jsonData),
        ContentType: 'application/json'
      };

      const s3 = new AWS.S3();
      try {
        const uploadResult = await s3.upload(s3Params).promise();
        console.log('File uploaded successfully:', uploadResult.Location);
      } catch (error) {
        console.error('Error uploading file to S3:', error);
      }

      setFormData({
        message: '',
        selectedTemplate: '',
        selectedUrl: ''
      });
      setShowWarning(false);
      setSelectedContentBody("");
      setSelectedCategory("");
      setSelectedSender("");
      setselectedURL("");
      setImagesSaved(0);
      setClickCount(prev => prev + 1);

      fetchData(selectedCategory);
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
              <h3>Select Brand:</h3>
              <select value={selectedBrand} onChange={handleBrandChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-800 focus:border-blue-00 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                {brands.map((brand, index) => (
                  <option key={index} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h3>Select Sender:</h3>
              <select value={selectedSender} onChange={handleSenderChange} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'>
                <option data-content value="">Select...</option>
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
              <div className="bg-gray-100 rounded-lg px-1 py-6 w-[275px] h-[500px] md:w-[300px] md:h-[525px] lg:w-[350px] lg:h-[600px] overflow-hidden relative flex items-center justify-center border border-black">
                <div className="phone-frame">
                  <div className="message-preview">
                    <div className="message-container">
                      <div className="sender">{formData.sender || 'Unknown Sender'}</div>
                      <div className="message user-message">
                        {formData.selectedTemplate || 'Your message will appear here.'}
                        {formData.selectedUrl}
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

export default SmishSimAndroid;
