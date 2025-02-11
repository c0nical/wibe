import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Добавим состояние для ошибок
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Сбрасываем ошибку перед попыткой входа
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); // Перенаправление на главную страницу после входа
    } catch (error) {
      console.error("Ошибка входа:", error.message);
      setError("Неверный email или пароль"); // Показываем ошибку пользователю
    }
  };

  return (
    <div className="w-full max-w-xs">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">Вход</h2>
      {error && <p className="text-white bg-red-500 text-center mb-4 rounded-lg p-1">{error}</p>} {/* Отображаем ошибку */}
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border-solid rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-black text-white"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border-solid rounded-lg focus:outline-none focus:ring-2 focus:ring-white bg-black text-white"
        />
        <button
          type="submit"
          className="w-full bg-inherit border-2 text-white font-bold py-2 rounded-lg hover:bg-white hover:text-black transition duration-200"
        >
          Войти
        </button>
      </form>
      <div className="flex justify-center align-center flex-col mt-4 gap-3 text-center items-center">
        <span className="text-white-600">Нет аккаунта? </span>
        <Link
          to="/signup"
          className="w-max text-black bg-white px-2 py-1 rounded-lg hover:text-white transition duration-200 hover:bg-black"
        >
          Зарегистрироваться
        </Link>
      </div>
    </div>
  );
};

export default Login;