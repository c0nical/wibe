import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Выход из аккаунта
      navigate("/login"); // Перенаправление на страницу входа
    } catch (error) {
      console.error("Ошибка выхода:", error.message);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет</h2>
      <p className="text-gray-300">Добро пожаловать в ваш личный кабинет!</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
      >
        Выйти
      </button>
    </div>
  );
};

export default Profile;