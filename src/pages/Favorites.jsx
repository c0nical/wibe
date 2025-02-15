import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { FaTrashAlt, FaHeart } from "react-icons/fa";
import ReactPlayer from "react-player";

const Favorites = ({ setCurrentTrack, setIsPlaying, currentTrack, isPlaying }) => {

    const handlePlayTrack = (track) => {
        // Приводим объект трека к ожидаемому формату
        const formattedTrack = {
          id: track.trackId, // Используем trackId, так как это оригинальный ID трека
          name: track.trackName, // Переименовываем trackName в name
          artist_name: track.artistName, // Переименовываем artistName в artist_name
          audio: track.trackUrl, // Переименовываем trackUrl в audio
          album_image: track.albumImage, // Переименовываем albumImage в album_image
          duration: track.duration, // Поле duration уже совпадает
        };
      
        console.log("Форматированный трек:", formattedTrack); // Проверь результат
      
        if (currentTrack?.id === formattedTrack.id && isPlaying) {
          setIsPlaying(false);
        } else {
          setCurrentTrack(formattedTrack);
          setIsPlaying(true);
        }
      };

  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const user = auth.currentUser;
      if (user) {
        const favoritesQuery = query(
          collection(db, "favorites"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(favoritesQuery);
        const favoriteTracks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFavorites(favoriteTracks);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (trackId) => {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "favorites", trackId);
      await deleteDoc(docRef);
      setFavorites(favorites.filter((track) => track.id !== trackId)); // Обновляем состояние после удаления
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-row items-center pb-4">
        <div className="flex p-5 rounded-lg bg-pink-600">
          <FaHeart size={32} />
        </div>
        <h1 className="text-2xl font-semibold px-4">Ваши избранные треки</h1>
      </div>

      {favorites.length === 0 ? (
        <p>У вас нет избранных треков.</p>
      ) : (
        <div className="bg-neutral-800 shadow-md rounded-lg py-4">
          <div className="grid grid-cols-10 gap-4 text-sm text-neutral-300 font-bold mb-4">
            <span className="col-span-1 text-center border-r-2 border-neutral-500">Фото</span>
            <span className="col-span-4 border-r-2 border-neutral-500">Название</span>
            <span className="col-span-2 border-r-2 border-neutral-500">Автор</span>
            <span className="col-span-2 border-r-2 border-neutral-500">Длительность</span>
            <span className="col-span-1 text-center">Удалить</span>
          </div>

          <div>
            {favorites.map((track) => (
              <div 
                key={track.id} 
                className="grid grid-cols-10 gap-4 items-center rounded-lg border-neutral-600 py-3 hover:bg-neutral-700 cursor-pointer"
                onClick={() => handlePlayTrack(track)} // Обработчик клика для воспроизведения
              >
                <div className="col-span-1 flex justify-center">
                  <img
                    src={track.albumImage}
                    alt={track.trackName}
                    className="w-12 h-12 object-cover rounded"
                  />
                </div>

                <div className="col-span-4 flex flex-col">
                  <span className="font-semibold text-lg">{track.trackName}</span>
                </div>

                <div className="col-span-2 text-neutral-400">{track.artistName}</div>
                <div className="col-span-2 text-sm text-neutral-400">{formatDuration(track.duration)}</div>

                <div className="col-span-1 flex justify-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Чтобы не срабатывал onClick на весь блок
                      handleRemoveFavorite(track.id);
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Вставляем компонент ReactPlayer для воспроизведения текущего трека */}
      {currentTrack && (
        <div className="player-container">
          <ReactPlayer
            url={currentTrack.trackUrl} // Передаем URL трека
            playing={isPlaying}          // Устанавливаем, играем ли мы
            controls={true}              // Показываем контролы
            width="100%"                 // Ширина плеера
            height="50px"                // Высота плеера
          />
        </div>
      )}
    </div>
  );
};

export default Favorites;
