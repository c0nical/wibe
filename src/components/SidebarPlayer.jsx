import React, { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";

const SidebarPlayer = ({ currentTrack, onPlayPause, onNext, onPrevious, isPlaying }) => {
    const [playedTime, setPlayedTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.5);
    const [isVolumeSliderVisible, setIsVolumeSliderVisible] = useState(false); // Состояние видимости ползунка громкости
    const playerRef = useRef(null);
  
    const handleProgress = (state) => {
      setPlayedTime(state.playedSeconds);
    };
  
    const handleDuration = (duration) => {
      setDuration(duration);
    };
  
    const handleProgressBarClick = (e) => {
      const progressBar = e.currentTarget;
      const clickPositionX = e.nativeEvent.offsetX;
      const progressBarWidth = progressBar.offsetWidth;
      const newPlayedTime = (clickPositionX / progressBarWidth) * duration;
  
      if (playerRef.current) {
        playerRef.current.seekTo(newPlayedTime, "seconds");
      }
    };
  
    const handleVolumeChange = (e) => {
      const newVolume = parseFloat(e.target.value);
      setVolume(newVolume);
    };
  
    const toggleVolumeSlider = () => {
      setIsVolumeSliderVisible((prev) => !prev);
    };
  
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };
  
    return (
      <div className="bg-[#272727] p-8 flex flex-col items-center ">
        {currentTrack ? (
          <>
            {currentTrack.album_image && (
              <img
                src={currentTrack.album_image}
                alt={currentTrack.album_name}
                className="w-32 h-32 object-cover rounded-lg mb-4"
              />
            )}
  
            <div className="mb-2 text-center">
              <h2 className="text-xl font-semibold">{currentTrack.name}</h2>
              <p className="text-sm text-gray-400"> {currentTrack.artist_name}</p>
            </div>
  
            <div className="w-full my-4">
              <ReactPlayer
                ref={playerRef}
                url={currentTrack.audio}
                playing={isPlaying}
                controls={false}
                width="0"
                height="0"
                volume={volume}
                onProgress={handleProgress}
                onDuration={handleDuration}
              />
  
              {/* Прогресс-бар */}
              <div
                className="relative w-full h-2 bg-gray-600 rounded-full cursor-pointer"
                onClick={handleProgressBarClick}
              >
                <div
                  className="absolute top-0 left-0 h-2 bg-green-500 rounded-full"
                  style={{ width: `${(playedTime / duration) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>{formatTime(playedTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
  
            {/* Регулятор громкости */}
            <div className="relative flex items-center mt-4">
              <button
                className="text-xl text-gray-400 hover:text-white"
                onClick={toggleVolumeSlider}
              >
                {volume > 0 ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>
  
              {isVolumeSliderVisible && (
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-700 p-2 rounded shadow-lg">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-32"
                  />
                </div>
              )}
            </div>
  
            <div className="flex justify-around items-center w-full mt-4">
    {/* Кнопка "Предыдущий трек" */}
    <button onClick={onPrevious} className="text-3xl text-gray-400 hover:text-white">
      <i className="bi bi-skip-start-fill"></i> {/* Иконка предыдущего трека */}
    </button>
  
    {/* Кнопка "Плей/Пауза" */}
    <button
      onClick={onPlayPause}
      className="text-3xl px-4 py-2 text-gray-400 hover:text-white flex items-center"
    >
      {isPlaying ? (
        <i className="bi bi-pause-fill"></i> // Иконка паузы
      ) : (
        <i className="bi bi-play-fill"></i> // Иконка воспроизведения
      )}
    </button>
  
    {/* Кнопка "Следующий трек" */}
    <button onClick={onNext} className="text-3xl text-gray-400 hover:text-white">
      <i className="bi bi-skip-end-fill"></i> {/* Иконка следующего трека */}
    </button>
  </div>
  
          </>
        ) : (
          <div className="text-center text-gray-400">Выберите трек для воспроизведения</div>
        )}
      </div>
    );
  };

export default SidebarPlayer;
