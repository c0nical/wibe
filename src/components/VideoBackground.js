import React from "react";
import video from "./background-video.mp4"; // Убедись, что путь к видео правильный

const VideoBackground = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[0] overflow-hidden">
      <video
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {/* Затемнение */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50"></div>
    </div>
  );
};

export default VideoBackground;