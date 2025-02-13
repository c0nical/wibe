import React from "react";
import { Outlet } from "react-router-dom";
import VideoBackground from "./VideoBackground";

const AuthLayout = () => {
  return (
    <div className="relative w-full h-screen flex justify-center items-center">
      <VideoBackground />
      <div className="z-10 bg-white bg-opacity-50 p-8 border-2 backdrop-blur-sm rounded-lg">
      <div className="flex flex-1 align-center justify-center p-6">
          <img src="./assets/img/logo/logo.png" className="w-32" alt="Logo" />
        </div>
        <Outlet /> {/* Здесь будут отображаться Login и SignUp */}
      </div>
    </div>
  );
};

export default AuthLayout;