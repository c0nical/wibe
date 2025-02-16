import React from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import gravatarUrl from "gravatar-url"; // Импортируем библиотеку

const Profile = () => {
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Выход из аккаунта
      navigate("/login"); // Перенаправление на страницу входа
    } catch (error) {
      console.error("Ошибка выхода:", error.message);
    }
  };

  if (loading) {
    return <div className="p-4">Загрузка...</div>; // Показываем загрузку, пока данные пользователя загружаются
  }

  if (!user) {
    return <div className="p-4">Пользователь не авторизован.</div>; // Если пользователь не авторизован
  }

  // Генерируем аватарку через Gravatar
  const photoURL = gravatarUrl(user.email, {
    size: 200,
    default: "retro",
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет</h2>

      {/* Основная информация о пользователе */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={photoURL} // Используем аватарку из Gravatar
          alt="Аватар"
          className="w-24 h-24 rounded-lg"
        />
        <div>
          <h3 className="text-xl font-bold">{user.displayName || "Пользователь"}</h3>
          <p className="text-neutral-400">{user.email}</p>
          <p className="text-sm text-neutral-500">
            Зарегистрирован: {new Date(user.metadata.creationTime).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Кнопка выхода */}
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