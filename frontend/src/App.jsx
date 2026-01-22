import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { HomePage } from "./Pages/HomePage.jsx";
import { LoginPage } from "./Pages/LoginPage.jsx";
import { ProfilePage } from "./Pages/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/authContext.jsx";

const App = () => {
  const { authUser, isAuthLoading } = useContext(AuthContext);

  // wait until auth check completes
  if (isAuthLoading) return null;

  return (
    <div className="bg-[url('./src/assets/bgImage.svg')] bg-contain">
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
