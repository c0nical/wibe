import React from "react";
import TrackList from "../components/TrackList";

const Home = ({ setCurrentTrack, setIsPlaying }) => {
  return <TrackList setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />;

};
export default Home;
