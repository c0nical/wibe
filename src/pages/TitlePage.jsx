import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TitlePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Проверяем, показывалась ли титульная страница
        const isVisited = localStorage.getItem("titlePageVisited");
        if (isVisited) {
            navigate("/login"); // Перенаправляем на страницу входа
        }
    }, [navigate]);

    const handleStart = () => {
        localStorage.setItem("titlePageVisited", "true"); // Запоминаем, что страницу показали
        navigate("/login"); // Переход на страницу входа
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-neutral-900 text-white">
            <img src="/assets/img/logo/logo.png" className="w-48" alt="Logo" />
            <h1 className="text-4xl font-bold">Веб-приложение для стриминга музыки</h1>
            <p className="mt-2 text-2xl">Дипломный проект</p>
            <p className="mt-1 text-2xl">Разработано: Сергей Ситдиков Фёдорович</p>
            <p className="mt-1 text-xl">Государственное бюджетное профессиональное образовательное учреждение "Пермский краевой колледж "ОНИКС"</p>
            <button onClick={handleStart} className="mt-4 px-6 py-2 bg-inherit border-2 text-white font-bold py-2 rounded-lg hover:bg-white hover:text-black transition duration-200">
                Перейти в приложение
            </button>
            <p className="absolute bottom-4">Пермь, {new Date().getFullYear()}</p>
        </div>
    );
};

export default TitlePage;
