import React from 'react';

function RadioButton({ radioName, radioState, setRadioState }) {
  return (
    <div className="inline-flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 w-32 my-1 mx-2">
      <input
        id={radioName}
        type="radio"
        value=""
        checked={radioState === radioName}
        onChange={() => setRadioState(radioName)}
        name={radioName}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label htmlFor={radioName} className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {radioName}
      </label>
    </div>
  );
}

function ImgRadioQuestionButton({ radioName, radioValue, checkedValue, setRadioState, index, itemID, labelValue }) {
  return (
    <div className="inline-flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 w-32 my-1 mx-2">
      <input
        id={labelValue+radioName}
        type="radio"
        value=""
        checked={checkedValue === radioValue}
        onChange={() => setRadioState(index, itemID, radioValue)}
        name={radioName}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label htmlFor={labelValue+radioName} className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
        {labelValue}
      </label>
    </div>
  );
}


function DemographicsRadioQuestionButton({ radioName, radioValue, checkedValue, setRadioState, index, itemID, labelValue }) {
  return (
    <div className="inline-flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700 w-64 my-1 mx-2 px-[1px]">
      <input
        id={labelValue+radioName}
        type="radio"
        value=""
        checked={checkedValue === radioValue}
        onChange={() => setRadioState(index, itemID)}
        name={radioName}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      <label htmlFor={labelValue+radioName} className="w-full py-4 ms-2 text-xs font-medium text-gray-900 dark:text-gray-300 pr-1">
        {labelValue}
      </label>
    </div>
  );
}


export { RadioButton, ImgRadioQuestionButton, DemographicsRadioQuestionButton };
