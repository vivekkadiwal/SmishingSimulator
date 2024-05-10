import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmishSimAndroid from './Pages/Android/SmishSimAndroid';
import SmishSimIos from './Pages/Ios/SmishSimIos';
import Login from './Pages/Research/Login';
import PreSurvey from './Pages/Research/PreSurvey';
import PostSurvey from './Pages/Research/PostSurvey';
import PreTrainingAndroid from './Pages/Android/PreTrainingAndroid';
import PostTrainingAndroid from './Pages/Android/PostTrainingAndroid';
import PreTrainingIos from './Pages/Ios/PreTrainingIos';
import PostTrainingIos from './Pages/Ios/PostTrainingIos';
import YoutubeTrain from './Pages/Other/YoutubeTrain';
import Demographics from './Pages/Research/Demographics';
import SystemUsability from './Pages/Research/SystemUsability';
import ImageExtract from './Pages/Other/ImageExtract';
import Apple from './Pages/Other/Apple';
import InstructionsPage from './Pages/Research/InstructionsPage';
import Test from './Pages/Other/Test';


const App = () => {
  return (
    <Router>
      <div style={{ textAlign: 'center' }}>
        {/* <h1>Survey</h1> */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/demographic-survey/:participantID" element={<Demographics />} />
          <Route path="/test" element={<Test />} />
          <Route path="/pre-survey/:participantID" element={<PreSurvey />} />
          <Route path="/pre-training-android/:participantID" element={<PreTrainingAndroid />} />
          <Route path="/pre-training-ios/:participantID" element={<PreTrainingIos />} />
          <Route path="/smish-sim-android/:participantID" element={<SmishSimAndroid />} />
          <Route path="/smish-sim-ios/:participantID" element={<SmishSimIos />} />
          <Route path="/youtube-train/:participantID" element={<YoutubeTrain />} />
          <Route path="/post-training-android/:participantID" element={<PostTrainingAndroid />} />
          <Route path="/post-training-ios/:participantID" element={<PostTrainingIos />} />
          <Route path="/post-survey/:participantID" element={<PostSurvey />} />
          <Route path="/systemusability-survey/:participantID" element={<SystemUsability />} />
          <Route path="/image-extract/" element={<ImageExtract />} />
          <Route path="/apple/" element={<Apple />} />
          <Route path="/instructions/:page/:participantID" element={<InstructionsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;