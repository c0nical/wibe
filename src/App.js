import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SidebarPlayer from "./components/SidebarPlayer";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import { auth } from "./firebase"; // Импортируем auth
import { useAuthState } from "react-firebase-hooks/auth"; // Импортируем хук

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user] = useAuthState(auth); // Проверяем авторизацию

  return (
    <Router>
<div className="h-screen flex flex-col bg-[#1C1C1C] text-white overflow-hidden">
  <header className="flex justify-between items-center bg-[#0F0F0F] p-4 shadow-md">
    <div className="text-xl font-bold">
      <img src="/assets/img/logo/logo.png" className="w-12" alt="Logo" />
    </div>
    <div className="flex items-center gap-4">
      <Link
        to="/profile"
        className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
      >
        Личный кабинет
      </Link>
    </div>
  </header>

  {/* Контейнер для сайдбара и контента */}
  <div className="flex flex-1 min-h-0 overflow-hidden">
    {/* Показываем сайдбар только авторизованным пользователям */}
    {user && (
      <aside className="w-64 bg-[#2E2E2E] h-full flex-shrink-0 overflow-y-auto">
        <nav className="p-4">
          <Link
            to="/"
            className="block bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
          >
            Главная
          </Link>
          <Link
            to="/library"
            className="block bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 mt-2"
          >
            Библиотека
          </Link>
        </nav>
        <SidebarPlayer
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
        />
      </aside>
    )}

    {/* Основной контент */}
    <main className="flex-1 p-6 overflow-y-auto bg-[#1C1C1C]">
      <Routes>
        {/* Защищённые маршруты */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/"
            element={
              <Home setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />
            }
          />
          <Route path="/library" element={<Library />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Маршруты для авторизации */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
      </Routes>
    </main>
  </div>
</div>
    </Router>
  );
}

export default App;