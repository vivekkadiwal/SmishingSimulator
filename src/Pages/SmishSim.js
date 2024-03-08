import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import './SmishSim.css';

const SmishSim = () => {
  const { participantID } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    message: '',
    sender: '',
    selectedTemplate: '',
    selectedUrl: ''
  });

  const [imagesSaved, setImagesSaved] = useState(false); // Track if 10 images have been saved

  const handleSenderChange = (sender) => {
    setFormData({ ...formData, sender });
  };

  const handleTemplateChange = (selectedTemplate) => {
    setFormData({ ...formData, selectedTemplate });
  };

  const handleUrlChange = (selectedUrl) => {
    setFormData({ ...formData, selectedUrl });
  };

  const saveAsImage = () => {
    const messagePreview = document.querySelector('.message-preview');
    html2canvas(messagePreview).then(canvas => {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `smish_${participantID}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Update imagesSaved state after saving image
      setImagesSaved(prev => prev + 1);
    });
  };

  const urlOptions = [
    { label: 'https://example.com', url: 'https://example.com' },
    { label: 'https://www.facebook.com', url: 'https://www.facebook.com' },
    { label: 'https://fakepaymentpage.com', url: 'https://fakepaymentpage.com' },
    { label: 'http://insecurewebsite.com', url: 'http://insecurewebsite.com' },
    { label: 'https://phishingwebsite.com', url: 'https://phishingwebsite.com' }
  ];


  if (imagesSaved === 10) {
    navigate(`/post-survey/${participantID}`);
  }

  return (
    <div className="smish-container">
      <div className="left-section">
        <h2>Smishing Simulator</h2>
        <div className="sender-section">
          <h3>Select Sender:</h3>
          {['ups@hotmail.com', 'HdFc@yahoo.com', 'DMVCalifornia@gmail.com', '6189283299@gmail.com', 'FirstBanking'].map((sender, index) => (
            <button
              key={index}
              className="sender-btn"
              onClick={() => handleSenderChange(sender)}
            >
              {sender}
            </button>
          ))}
        </div>
        <div className="template-section">
          <h3>Select Message Body:</h3>
          {['Your account has been compromised. Click here to reset your password.',
            'Congratulations! You\'ve won a prize. Click here to claim it.',
            'Alert: Your account will be suspended if you don\'t update your information. Click here.',
            'Your payment has been declined. Click here to update your payment method.',
            'Important: Please review your recent transaction by clicking here.'
          ].map((template, index) => (
            <button
              key={index}
              className="template-btn"
              onClick={() => handleTemplateChange(template)}
            >
              {template}
            </button>
          ))}
        </div>
        <div className="url-section">
          <h3>Select URL:</h3>
          {urlOptions.map((option, index) => (
            <button
              key={index}
              className="url-btn"
              onClick={() => handleUrlChange(option.url)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <button className="save-btn" onClick={saveAsImage}>Save as Image</button>        
        <br />
      </div>
      <div className="right-section">
        <h2>Message Preview</h2>
        <div className="phone-screen">
          <div className="phone-frame">
            <div className="message-preview">
              <div className="message-container">
                <div className="sender">{formData.sender || 'Unknown Sender'}</div>
                <div className="message user-message">
                  {formData.selectedTemplate || formData.message || 'Your message will appear here.'}
                  {formData.selectedUrl && (
                    <span className="url-link">
                      Click here: <a href={formData.selectedUrl}>{formData.selectedUrl}</a>
                    </span>
                  )}
                </div>
              </div>
              <div className="reply-field">
                <textarea placeholder="Type your reply here..." readOnly></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmishSim;
