// import React from 'react';
// import './App.css';
// import PreSurvey from './Pages/PreSurvey';
// import PostSurvey from './Pages/PostSurvey';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Welcome to the Survey App</h1>
//         <PreSurvey />
//         <PostSurvey />
//       </header>
//     </div>
//   );
// }

// export default App;

// import React from 'react';
// import SmishSim from './Pages/SmishSim';
// import Login from './Pages/Login';
// import PreSurvey from './Pages/PreSurvey';
// import PostSurvey from './Pages/PostSurvey';



// const App = () => {
//   return (
//     <div>
//       <h1>My Smishing App</h1>
//       <SmishSim />
//       {/* <PreSurvey /> */}
//       {/* <PostSurvey /> */}
//     </div>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SmishSim from './Pages/SmishSim';
import Login from './Pages/Login';
import PreSurvey from './Pages/PreSurvey';
import PostSurvey from './Pages/PostSurvey';
import PreTraining from './Pages/PreTraining';
import PostTraining from './Pages/PostTraining';
import YoutubeTrain from './Pages/YoutubeTrain';

import ImageExtract from './Pages/ImageExtract';
import Apple from './Pages/Apple';


const App = () => {
  return (
    <Router>
      <div>
        <h1>My Smishing App</h1>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/pre-survey/:participantID" element={<PreSurvey />} />
          <Route path="/pre-training/:participantID" element={<PreTraining />} />
          <Route path="/smish-sim/:participantID" element={<SmishSim />} />
          <Route path="/youtube-train/:participantID" element={<YoutubeTrain />} />
          <Route path="/post-training/:participantID" element={<PostTraining />} />
          <Route path="/post-survey/:participantID" element={<PostSurvey />} />

          <Route path="/image-extract/" element={<ImageExtract />} />
          <Route path="/apple/" element={<Apple />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
