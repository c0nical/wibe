import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import SidebarPlayer from "./components/SidebarPlayer";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import AuthLayout from "./components/AuthLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import TitlePage from "./pages/TitlePage";
import Favorites from "./pages/Favorites";
import SearchResults from "./pages/SearchResults";
import { FaSearch } from "react-icons/fa";
import { auth } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";

function Loader() {
  return (
    <div className="h-screen flex items-center justify-center bg-[#1C1C1C] text-white">
      <p className="text-xl">Загрузка...</p>
    </div>
  );
}

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <header className="flex justify-between items-center bg-[#0F0F0F] p-4 shadow-md">
      <div className="flex gap-6">
        <img src={`${process.env.PUBLIC_URL}/assets/img/logo/logo.png`} className="w-12" alt="Logo" />
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-4 py-2 rounded bg-neutral-700 text-white focus:outline-none w-64"
          />
          <button
            onClick={handleSearch}
            className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-400 hover:text-green-500"
          >
            <FaSearch size={18} />
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/profile" className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">
          Личный кабинет
        </Link>
      </div>
    </header>
  );
};

const AppLayout = ({ user, currentTrack, setCurrentTrack, isPlaying, setIsPlaying }) => {
  const location = useLocation();
  const [hoverPos, setHoverPos] = useState(null);

  useEffect(() => {
    const hideHover = setTimeout(() => setHoverPos(null), 2000);
    return () => clearTimeout(hideHover);
  }, [hoverPos]);

  if (["/", "/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-[#1C1C1C] text-white overflow-hidden">
      <Header />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {user && (
          <aside className="w-64 bg-[#2E2E2E] h-full flex-shrink-0 overflow-y-auto relative">
            <nav className="p-4 relative">
              <div
                className="absolute bg-neutral-600 transition-all duration-300 rounded"
                style={{
                  width: "calc(100% - 2rem)",
                  height: "40px",
                  top: hoverPos?.top || 0,
                  left: "1rem",
                  opacity: hoverPos ? 1 : 0,
                }}
              ></div>
              {[
                { path: "/home", label: "Главная" },
                { path: "/library", label: "Библиотека" },
                { path: "/favorites", label: "Избранное" },
              ].map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  className="block relative px-4 py-2 rounded mt-2 hover:outline hover:outline-2 hover:outline-neutral-500"
                  onMouseEnter={(e) => setHoverPos({ top: e.target.offsetTop })}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <SidebarPlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying(!isPlaying)}
            />
          </aside>
        )}
        <main className="flex-1 p-6 overflow-y-auto bg-[#1C1C1C]">
          <Routes>
            <Route element={<ProtectedRoute user={user} />}>
              <Route path="/home" element={<Home setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />} />
              <Route path="/library" element={<Library />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/favorites" element={<Favorites setCurrentTrack={setCurrentTrack} setIsPlaying={setIsPlaying} />} />
              <Route path="/search" element={<SearchResults />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
};

function App() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [user, loading] = useAuthState(auth);

  if (loading) return <Loader />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <TitlePage /> : <Navigate to="/home" replace />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/home" replace /> : <SignUp />} />
        </Route>
        <Route
          path="/*"
          element={<AppLayout user={user} currentTrack={currentTrack} setCurrentTrack={setCurrentTrack} isPlaying={isPlaying} setIsPlaying={setIsPlaying} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
