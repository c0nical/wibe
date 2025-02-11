import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { auth } from "../firebase"; // Убедись, что путь к firebase правильный
import { useAuthState } from "react-firebase-hooks/auth";

const ProtectedRoute = () => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;