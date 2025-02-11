import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom"; // Импортируем Link
import { auth } from "../firebase"; // Правильный путь
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Ошибка регистрации:", error.message);
    }
  };

  return (
    <div className="w-full max-w-xs">
      <h2 className="text-2xl font-bold mb-4 text-center text-black">Регистрация</h2>
      <form onSubmit={handleSignUp} className="space-y-4">
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
          Зарегистрироваться
        </button>
      </form>
      <div className="mt-4 text-center">
        <span className="text-white-600">Уже есть аккаунт? </span>
        <Link
          to="/login"
          className="text-black bg-white px-2 py-1 rounded-lg hover:text-white transition duration-200 hover:bg-black"
        >
          Войти
        </Link>
      </div>
    </div>
  );
};

export default SignUp;