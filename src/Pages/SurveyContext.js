    // SurveyContext.js
import React, { createContext, useContext, useState } from 'react';

const SurveyContext = createContext();

export const useSurveyContext = () => useContext(SurveyContext);

export const SurveyProvider = ({ children }) => {
  const [surveyResponses, setSurveyResponses] = useState({
    preSurvey: [],
    smishSim: [],
    postSurvey: [],
  });

  const addPreSurveyResponse = (response) => {
    setSurveyResponses({ ...surveyResponses, preSurvey: [...surveyResponses.preSurvey, response] });
  };

  const addSmishSimResponse = (response) => {
    setSurveyResponses({ ...surveyResponses, smishSim: [...surveyResponses.smishSim, response] });
  };

  const addPostSurveyResponse = (response) => {
    setSurveyResponses({ ...surveyResponses, postSurvey: [...surveyResponses.postSurvey, response] });
  };

  return (
    <SurveyContext.Provider value={{ surveyResponses, addPreSurveyResponse, addSmishSimResponse, addPostSurveyResponse }}>
      {children}
    </SurveyContext.Provider>
  );
};
