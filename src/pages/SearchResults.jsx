import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery) {
        try {
          const response = await axios.get("https://api.jamendo.com/v3.0/tracks/", {
            params: {
              client_id: process.env.REACT_APP_JAMENDO_API_KEY,
              format: "json",
              search: searchQuery,
              limit: 10,
            },
          });
          setSearchResults(response.data.results);
        } catch (error) {
          console.error("Ошибка при поиске:", error);
        }
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Результаты поиска: "{searchQuery}"</h1>

      <div className="bg-neutral-800 shadow-md rounded-lg py-4">
        <div className="grid grid-cols-9 gap-4 text-sm text-neutral-300 font-bold mb-4">
          <span className="col-span-1 text-center border-r-2 border-neutral-500">Фото</span>
          <span className="col-span-4 border-r-2 border-neutral-500">Название</span>
          <span className="col-span-2 border-r-2 border-neutral-500">Автор</span>
          <span className="col-span-2 text-center">Длительность</span>
        </div>

        <div>
          {searchResults.map((track) => (
            <div
              key={track.id}
              className="grid grid-cols-9 gap-4 items-center rounded-lg border-neutral-600 py-3 hover:bg-neutral-700 cursor-pointer"
            >
              <div className="col-span-1 flex justify-center">
                <img
                  src={track.album_image}
                  alt={track.album_name}
                  className="w-12 h-12 object-cover rounded"
                />
              </div>

              <div className="col-span-4 flex flex-col">
                <span className="font-semibold text-lg">{track.name}</span>
              </div>

              <div className="col-span-2 text-neutral-400">{track.artist_name}</div>
              <div className="col-span-2 text-sm text-neutral-400 text-center">
                {formatDuration(track.duration)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;