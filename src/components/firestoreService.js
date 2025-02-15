import { db } from "./firebase";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";

export const toggleFavoriteTrack = async (userId, track) => {
  if (!userId) return;
  const trackRef = doc(db, `users/${userId}/favorites`, track.id);

  try {
    const docSnap = await getDoc(trackRef);
    if (docSnap.exists()) {
      await deleteDoc(trackRef);
      console.log(`Трек ${track.name} удалён из избранного`);
      return false;
    } else {
      await setDoc(trackRef, track);
      console.log(`Трек ${track.name} добавлен в избранное`);
      return true;
    }
  } catch (error) {
    console.error("Ошибка при обновлении избранного:", error);
  }
};

import { collection, addDoc } from "firebase/firestore";

export const createPlaylist = async (userId, playlistName) => {
  if (!userId) return;
  try {
    const playlistsRef = collection(db, `users/${userId}/playlists`);
    const newPlaylist = await addDoc(playlistsRef, { name: playlistName, tracks: [] });
    console.log(`Плейлист "${playlistName}" создан!`);
    return newPlaylist.id;
  } catch (error) {
    console.error("Ошибка при создании плейлиста:", error);
  }
};

import { doc, updateDoc, arrayUnion } from "firebase/firestore";

export const addTrackToPlaylist = async (userId, playlistId, track) => {
  if (!userId || !playlistId) return;
  try {
    const playlistRef = doc(db, `users/${userId}/playlists/${playlistId}`);
    await updateDoc(playlistRef, { tracks: arrayUnion(track) });
    console.log(`Трек "${track.name}" добавлен в плейлист!`);
  } catch (error) {
    console.error("Ошибка при добавлении трека в плейлист:", error);
  }
};