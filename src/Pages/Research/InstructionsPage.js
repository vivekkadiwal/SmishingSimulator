import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
// import { RadioButton } from '../../Components/RadioButton';

const InstructionsPage = () => {
  const { page, participantID } = useParams();
  const navigate = useNavigate();

  const [platformPreference, setPlatformPreference] = useState('Android');

  let instructions = '';
  let prevPage = '';
  let nextPage = '';

  switch (page) {
    case 'demographic-survey':
      instructions = (
        <div className='containerStyle'>
          <div className="question-border">
            <h3>Demographics Questionnaire</h3>
            <p> Please read and answer each of the following pre-survey questions.</p>
            {/* <ol className="list-decimal list-inside">
              <li>Please read and answer each of the following demographic survey questions.</li>
            </ol> */}
          </div>
        </div>
      );
      prevPage = '/';
      nextPage = `/demographic-survey/${participantID}`;
      break;
    case 'pre-survey':
      instructions = (
        <div className='containerStyle'>
          <div className="question-border">
            <h3> Pre-Survey</h3>
            <p> Please read and answer each of the following pre-survey questions.</p>
          </div>
        </div>
      );
      prevPage = '/';
      nextPage = `/pre-survey/${participantID}`;
      break;
    case 'pre-training':
      instructions = (
        <div className='containerStyle'>
          <div className='w-full md:w-11/12 mx-auto'>
            <h4 className='text-left'>Instructions:.</h4>
            <ol className=" list-decimal list-inside text-left">
              {/* <li>In the next section, your task is to classify whether SMS messages are Real or Fake.</li> */}
              <li className=' md:pl-4'>In the next section, your task is to classify whether SMS messages are Real or Fake</li>
              <li className=' md:pl-4'>Click on <b>Real</b> if you believe the message is a genuine SMS communication from a legitimate source. </li>
              <li className=' md:pl-4'>Click on <b>Fake</b> if you believe the message is a fraudulent SMS communication from an illegitimate source. </li>
              <li className='font-extrabold md:pl-4'>Please <span className='font-extrabold text-red-700'>DO NOT</span> attempt to send and SMS to the number mentioned in the message.</li>
              <li className='font-extrabold md:pl-4'>Please <span className=' text-red-700'>DO NOT</span> attempt to visit any links mentioned in the messages.</li>
            </ol>
          </div>
          <div>
            {/* <p className=' py-1'>What platform do you prefer?</p> */}
            {/* <hr className="line" /> */}
            {/* <div>
              <RadioButton radioName="Android" radioState={platformPreference} setRadioState={setPlatformPreference} />
              <RadioButton radioName="iOS" radioState={platformPreference} setRadioState={setPlatformPreference} />
            </div> */}
          </div>
        </div>
      );
      prevPage = `/pre-survey/${participantID}`;
      nextPage = platformPreference === 'Android'
        ? `/pre-training-android/${participantID}`
        : `/pre-training-ios/${participantID}`;
      break;
    case 'smish-sim-android':
      instructions = (
        <div className='containerStyle'>
          <div className="question-border">
            <div className='w-full md:w-11/12 mx-auto'>
              <h4 className='text-left'>Instructions:</h4>
              <ol className=" list-decimal list-inside text-left">
                {/* <li>In the next section, your task is to classify whether SMS messages are Real or Fake.</li> */}
                <li className=' md:pl-4'>A variety of Brands, Sender Numbers, Message Scenarios, and URLs are used by attackers in smishing scams. </li>
                <li className=' md:pl-4'>In the upcoming task, we request that you take on the perspective of a scammer and generate 10 SMS phishing messages. </li>
                <li className=' md:pl-4'>Please select Category, Sender, Message Body, and URLs for the SMS message in the specified order. </li>
                <li className='font-extrabold md:pl-4'>Please <span className='font-extrabold text-red-700'>DO NOT</span> attempt to send and SMS to the number mentioned in the message.</li>
                <li className='font-extrabold md:pl-4'>Please <span className=' text-red-700'>DO NOT</span> attempt to visit any links mentioned in the messages.</li>
              </ol>
            </div>
          </div>
        </div>
      );
      prevPage = `/pre-training-android/${participantID}`;
      nextPage = `/smish-sim-android/${participantID}`;
      break;
    case 'smish-sim-ios':
      instructions = (
        <div className='containerStyle'>
          <div className="question-border">
            <div className='w-full md:w-11/12 mx-auto'>
              <h4 className='text-left'>Instructions:</h4>
              <ol className=" list-decimal list-inside text-left">
                {/* <li>In the next section, your task is to classify whether SMS messages are Real or Fake.</li> */}
                <li className=' md:pl-4'>A variety of Brands, Sender Numbers, Message Scenarios, and URLs are used by attackers in smishing scams. </li>
                <li className=' md:pl-4'>In the upcoming task, we request that you take on the perspective of a scammer and generate 10 SMS phishing messages. </li>
                <li className=' md:pl-4'>Please select Category, Sender, Message Body, and URLs for the SMS message in the specified order. </li>
                <li className='font-extrabold md:pl-4'>Please <span className='font-extrabold text-red-700'>DO NOT</span> attempt to send and SMS to the number mentioned in the message.</li>
                <li className='font-extrabold md:pl-4'>Please <span className=' text-red-700'>DO NOT</span> attempt to visit any links mentioned in the messages.</li>
              </ol>
            </div>
          </div>
        </div>
      );
      prevPage = `/pre-training-ios/${participantID}`;
      nextPage = `/smish-sim-ios/${participantID}`;
      break;
    case 'post-training-android':
      instructions = (
        <div className='containerStyle'>
          <div className="question-border">
            <div className='w-full md:w-11/12 mx-auto'>
              <h4 className='text-left'>Instructions:.</h4>
              <ol className=" list-decimal list-inside text-left">
                {/* <li>In the next section, your task is to classify whether SMS messages are Real or Fake.</li> */}
                <li className=' md:pl-4'>In the next section, your task is to classify whether SMS messages are Real or Fake</li>
                <li className=' md:pl-4'>Click on <b>Real</b> if you believe the message is a genuine SMS communication from a legitimate source. </li>
                <li className=' md:pl-4'>Click on <b>Fake</b> if you believe the message is a fraudulent SMS communication from an illegitimate source. </li>
                <li className='font-extrabold md:pl-4'>Please <span className='font-extrabold text-red-700'>DO NOT</span> attempt to send and SMS to the number mentioned in the message.</li>
                <li className='font-extrabold md:pl-4'>Please <span className=' text-red-700'>DO NOT</span> attempt to visit any links mentioned in the messages.</li>
              </ol>
            </div>
          </div>
        </div>
      );
      prevPage = `/smish-sim-android/${participantID}`;
      nextPage = `/post-training-android/${participantID}`;
      break;
    case 'post-training-ios':
      instructions = (
        <div className='containerStyle'>
            <div className='w-full md:w-11/12 mx-auto'>
              <h4 className='text-left'>Instructions:.</h4>
              <ol className=" list-decimal list-inside text-left">
                {/* <li>In the next section, your task is to classify whether SMS messages are Real or Fake.</li> */}
                <li className=' md:pl-4'>In the next section, your task is to classify whether SMS messages are Real or Fake</li>
                <li className=' md:pl-4'>Click on <b>Real</b> if you believe the message is a genuine SMS communication from a legitimate source. </li>
                <li className=' md:pl-4'>Click on <b>Fake</b> if you believe the message is a fraudulent SMS communication from an illegitimate source. </li>
                <li className='font-extrabold md:pl-4'>Please <span className='font-extrabold text-red-700'>DO NOT</span> attempt to send and SMS to the number mentioned in the message.</li>
                <li className='font-extrabold md:pl-4'>Please <span className=' text-red-700'>DO NOT</span> attempt to visit any links mentioned in the messages.</li>
              </ol>
            </div>
        </div>
      );
      prevPage = `/smish-sim-ios/${participantID}`;
      nextPage = `/post-training-ios/${participantID}`;
      break;
    case 'post-survey':
      instructions = (
        <div className='containerStyle'>
          <div className="question-border">
            <h3> Post-Survey</h3>
            <p> Please read and answer each of the following pre-survey questions.</p>
          </div>
        </div>
      );
      prevPage = `/post-training/${participantID}`;
      nextPage = `/post-survey/${participantID}`;
      break;
    case 'systemusability-survey':
      instructions = (
        <div className='containerStyle'>
          <div className="question-border">
            <h3> System Usability Survey</h3>
            <p> Please read and answer each of the following pre-survey questions.</p>
          </div>
        </div>
      );
      prevPage = `/post-survey/${participantID}`;
      nextPage = `/systemusability-survey/${participantID}`;
      break;
    default:
      instructions = 'Instructions not found';
  }

  const handleNext = () => {
    navigate(nextPage);
  };

  return (
    <div>
      <h2>Instructions</h2>
      {instructions}
      <div>
        <Link className='py-2' to={prevPage}>
          <button className=' mx-0'>Back</button>
        </Link>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
};

export default InstructionsPage;