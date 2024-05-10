import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import './Style/YoutubeTrain.css';

function YoutubeTrain() {
  const [showNextButton, setShowNextButton] = useState(false);
  const [showReplayButton, setShowReplayButton] = useState(false);
  let player;
  const { participantID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = createYouTubePlayer;
    window.addEventListener('keydown', function(e) {
      e.preventDefault();
    });

    function createYouTubePlayer() {
      player = new window.YT.Player('player', {
        height: '480',
        width: '853',
        videoId: 'ZOZGQeG8avQ',
        playerVars: {
          'autoplay': 1,
          'controls': 0,
          'rel': 0,
          'enablejsapi': 1,
          'modestbranding': 1,
          'showinfo': 0,
          'allowfullscreen': 1,
          'origin': window.location.origin
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    function onPlayerReady(event) {
    }

    function onPlayerStateChange(event) {
      if (event.data === window.YT.PlayerState.ENDED) {
        setShowNextButton(true);
        setShowReplayButton(true);
      }
      
    }

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  const handleNextButtonClick = () => {
    navigate(`/post-training/${participantID}`);
  };

  const handleReplayButtonClick = () => {
    if (player) {
      player.seekTo(0);
      player.playVideo();
      setShowReplayButton(false);
    }
  };

  return (
    <div>
      <p>If Video doesn't appear, please refresh the page</p>
      <div className="video-container">
        <div id="player"></div>
        <div className="button-container">
          {showNextButton && (
            <button className='rounded-green-button' onClick={handleNextButtonClick}>Next Page</button>
          )}
          {/* {showReplayButton && (
            <button className='rounded-blue-button' onClick={handleReplayButtonClick}>Replay</button>
          )} */}
        </div>
      </div>
    </div>
  );
}

export default YoutubeTrain;