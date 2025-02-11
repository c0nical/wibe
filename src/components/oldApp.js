import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import ReactPlayer from 'react-player';
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa"; // Иконки громкости
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { SkeletonTheme } from "react-loading-skeleton";

// Компонент для отображения списка треков
const TrackList = ({ setCurrentTrack, setIsPlaying }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTracks = async () => {
    try {
      const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
        params: {
          client_id: "5fa44b86", // Замените на ваш Client ID
          format: "json",
          limit: 11,
        },
      });

      setTracks(response.data.results);
    } catch (error) {
      console.error("Ошибка при загрузке треков:", error);
    } finally {
      setLoading(false); // Скрываем скелетоны после загрузки
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const handlePlay = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  return (
    <SkeletonTheme baseColor="#2d3748" highlightColor="#4a5568">
    <div className="p-6 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Список треков</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-6">
        {loading
          ? // Отображаем 10 скелетонов, пока идет загрузка
            Array(10)
              .fill()
              .map((_, index) => <TrackSkeleton key={index} />)
          : // Отображаем реальные треки
            tracks.map((track) => (
              <div
                key={track.id}
                className="bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition cursor-pointer flex flex-col items-center"
                onClick={() => handlePlay(track)}
              >
                <div className="mb-4 flex justify-center items-center">
                  {track.album_image ? (
                    <img
                      src={track.album_image}
                      alt={track.album_name}
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-40 h-40 bg-gray-600 rounded-lg"></div>
                  )}
                </div>
                <h2 className="text-lg font-semibold h-16 mb-2 text-left">
                  {track.name}
                </h2>
                <p className="text-sm text-gray-400 text-center">
                  {track.artist_name}
                </p>
              </div>
            ))}
      </div>
    </div>
    </SkeletonTheme>
  );
};

// Компонент скелетон-загрузки
const TrackSkeleton = () => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col items-center">
    <Skeleton width={160} height={160} borderRadius={8} />
    <h2 className="mt-4">
      <Skeleton width={120} height={20} />
    </h2>
    <p className="mt-2">
      <Skeleton width={100} height={15} />
    </p>
  </div>
);



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
    <div className="bg-[#272727] p-4 flex flex-col items-center sticky top-0 h-screen">
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


function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Функции управления плеером
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleNext = () => {
    // Логика для перехода к следующему треку
  };
  const handlePrevious = () => {
    // Логика для перехода к предыдущему треку
  };

  return (
    <Router>
      <div className="h-screen flex flex-col bg-[#1C1C1C] text-white">
        {/* Header */}
        <header className="flex justify-between items-center bg-[#0F0F0F] p-4">
          <div className="text-xl font-bold">
            <img src="/assets/img/logo/logo.png" className="w-12" alt="Logo" />
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Личный кабинет</button>
          </div>
        </header>

  {/* Main layout */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
  <aside className="flex flex-col w-64 bg-[#2E2E2E] h-screen sticky top-0">
  {/* Navigation */}
  <nav className="flex-1 p-4">
    <ul className="space-y-4">
      <li>
        <Link to="/" className="w-full block bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
          Главная
        </Link>
      </li>
      <li>
        <Link to="/library" className="w-full block bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
          Библиотека
        </Link>
      </li>
    </ul>
  </nav>

  {/* Player */}
  <div className="p-4 bg-[#272727]">
    <SidebarPlayer
      currentTrack={currentTrack}
      onPlayPause={handlePlayPause}
      onNext={handleNext}
      onPrevious={handlePrevious}
      isPlaying={isPlaying}
    />
  </div>
</aside>


  {/* Main Content */}
  <main className="flex-1 p-6 bg-[#1C1C1C] overflow-y-auto">
    <Routes>
      <Route path="/" element={<TrackList setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />} />
      <Route path="/library" element={<div>Library Content</div>} />
    </Routes>
  </main>
</div>
      </div>
    </Router>
  );
}

export default App;
