import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categories = [
  { title: "Новинки", params: { order: "releasedate" } },
  { title: "Популярные", params: { order: "popularity_total" } },
  { title: "Звук Skaut", params: { artist_name: "Skaut" } },
  { title: "Жанр: Рок", params: { tag: "rock" } },
];

const TrackList = ({ setCurrentTrack, setIsPlaying }) => {
  return (
    <SkeletonTheme baseColor="#4F4F4F" highlightColor="#A6A6A6">
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-6">Главная</h1>
        <hr className="border-2 rounded border-white mb-6"></hr>
        {categories.map((category, index) => (
          <TrackCategory
            key={index}
            title={category.title}
            params={category.params}
            setCurrentTrack={setCurrentTrack}
            setIsPlaying={setIsPlaying}
          />
        ))}
      </div>
    </SkeletonTheme>
  );
};

const TrackCategory = ({ title, params, setCurrentTrack, setIsPlaying }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchTracks = async () => {
      console.log(`Запрос данных для категории: ${title}`, params); // Логируем параметры запроса
      try {
        const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
          params: {
            client_id: process.env.REACT_APP_JAMENDO_API_KEY,
            format: "json",
            limit: 10,
            ...params,
          },
        });

        console.log(`Ответ API для ${title}:`, response.data.results); // Логируем полученные треки

        if (response.data.results.length === 0) {
          console.warn(`❗ Нет данных для категории: ${title}`);
        }

        setTracks(response.data.results);
      } catch (error) {
        console.error(`Ошибка при загрузке треков для ${title}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [params, title]); // Добавил title в зависимости

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstChild;
      const cardWidth = card ? card.offsetWidth + parseInt(window.getComputedStyle(card).marginRight) : 300; // Учитываем margin
      scrollRef.current.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8 overflow-x-auto bg-neutral-900 p-5 rounded-lg">
      <div className="flex justify-between items-center mb-4 bg-gray-800 p-4 rounded-lg">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll(-1)}
            className="p-2 bg-inherit border-2 border-solid border-gray-600 rounded hover:bg-gray-600"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => handleScroll(1)}
            className="p-2 bg-inherit border-2 border-solid border-gray-600 rounded hover:bg-gray-600"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-4 overflow-x-hidden p-2">
        {loading
          ? Array(5)
              .fill()
              .map((_, index) => <TrackSkeleton key={index} />)
          : tracks.map((track) => (
              <div
                key={track.id}
                className="bg-neutral-800 p-4 rounded-lg shadow-md hover:bg-neutral-700 transition cursor-pointer flex flex-col items-center min-w-[180px]"
                onClick={() => {
                  setCurrentTrack(track);
                  setIsPlaying(true);
                }}
              >
                <div className="mb-4">
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
                <h3 className="text-lg font-semibold text-center h-12 overflow-hidden">
                  {track.name}
                </h3>
                <p className="text-sm text-gray-400 text-center">{track.artist_name}</p>
              </div>
            ))}
      </div>
    </div>
  );
};

const TrackSkeleton = () => (
  <div className="bg-neutral-800 p-4 rounded-lg shadow-md flex flex-col items-center min-w-[180px]">
    <Skeleton width={160} height={160} borderRadius={8} />
    <h2 className="mt-4">
      <Skeleton width={120} height={20} />
    </h2>
    <p className="mt-2">
      <Skeleton width={100} height={15} />
    </p>
  </div>
);

export default TrackList;