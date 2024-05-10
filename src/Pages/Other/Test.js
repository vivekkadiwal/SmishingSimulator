import React, { useState } from 'react';

const PhoneTextSimulator = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [sender, setSender] = useState('Me');
  const [incomingText, setIncomingText] = useState('');
  const [outgoingText, setOutgoingText] = useState('');

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSenderChange = (e) => {
    setSender(e.target.value);
  };

  const handleIncomingTextChange = (e) => {
    setIncomingText(e.target.value);
  };

  const handleOutgoingTextChange = (e) => {
    setOutgoingText(e.target.value);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: sender,
      };
      setMessages([...messages, newMessage]);
      setInputText('');
    }
  };

  const handleSendIncomingMessage = () => {
    if (incomingText.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        text: incomingText,
        sender: 'Incoming',
      };
      setMessages([...messages, newMessage]);
      setIncomingText('');
    }
  };

  const handleSendOutgoingMessage = () => {
    if (outgoingText.trim() !== '') {
      const newMessage = {
        id: messages.length + 1,
        text: outgoingText,
        sender: 'Outgoing',
      };
      setMessages([...messages, newMessage]);
      setOutgoingText('');
    }
  };

  return (
    <div className="phone-text-simulator">
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className={`message ${message.sender.toLowerCase()}`}>
            <p>{message.sender !== 'Incoming' && message.sender !== 'Outgoing' ? `${message.sender}: ${message.text}` : message.text}</p>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Type a message..."
        />
        <select value={sender} onChange={handleSenderChange}>
          <option value="Me">Me</option>
          <option value="Friend">Friend</option>
        </select>
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div className="preview-container">
        <h3>Preview</h3>
        <input
          type="text"
          value={incomingText}
          onChange={handleIncomingTextChange}
          placeholder="Incoming message..."
        />
        <button onClick={handleSendIncomingMessage}>Send Incoming</button>
        <input
          type="text"
          value={outgoingText}
          onChange={handleOutgoingTextChange}
          placeholder="Outgoing message..."
        />
        <button onClick={handleSendOutgoingMessage}>Send Outgoing</button>
      </div>
    </div>
  );
};

export default PhoneTextSimulator;
