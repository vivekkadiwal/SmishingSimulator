import React, { useState } from 'react';
import './Apple.css'; // Import CSS file for styling

const Apple = () => {
  const [senderName, setSenderName] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [sentMessage, setSentMessage] = useState('');

  const handleReceivedTextClick = (text) => {
    setReceivedMessage(text);
  };

  const handleSentTextClick = (text) => {
    setSentMessage(text);
  };

  return (
    <div className="apple-wrapper">
      <div className="iphone">
        <div className="iphone-inner">
          <div className="iphone-screen">
            {/* Text messaging app interface */}
            <div className="messaging-app">
              {/* Header */}
              <div className="header">
                <div className="back-button"></div>
                <div className="contact-name">{senderName}</div>
                <div className="options-button"></div>
              </div>
              {/* Messages */}
              <div className="messages">
                {/* Received message */}
                {receivedMessage && (
                  <div className="message from-contact">
                    <div className="message-content">{receivedMessage}</div>
                  </div>
                )}
                {/* Sent message */}
                {sentMessage && (
                  <div className="message from-me">
                    <div className="message-content">{sentMessage}</div>
                  </div>
                )}
              </div>
              {/* Message input */}
              <div className="message-input">
                <input type="text" placeholder="Type a message..." />
                <button onClick={() => setSentMessage(document.querySelector(".message-input input").value)}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Left side texts for sender names */}
      <div className="left-texts sender-names">
        <div className="text" onClick={() => setSenderName("Alice")}>Alice</div>
        <div className="text" onClick={() => setSenderName("Bob")}>Bob</div>
        <div className="text" onClick={() => setSenderName("Charlie")}>Charlie</div>
        <div className="text" onClick={() => setSenderName("David")}>David</div>
        <div className="text" onClick={() => setSenderName("Emily")}>Emily</div>
      </div>
      {/* Right side texts for message options */}
      <div className="right-texts message-options">
        <div className="text" onClick={() => setSentMessage("Hello!")}>Hello!</div>
        <div className="text" onClick={() => setSentMessage("How are you?")}>How are you?</div>
        <div className="text" onClick={() => setSentMessage("What's up?")}>What's up?</div>
        <div className="text" onClick={() => setSentMessage("Good morning!")}>Good morning!</div>
        <div className="text" onClick={() => setSentMessage("Good evening!")}>Good evening!</div>
      </div>
    </div>
  );
};

export default Apple;