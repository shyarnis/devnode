import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import ForgetPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";
import AppContainer from "./components/AppContainer";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { setNavigate } from "./lib/navigation";

function App() {
  const navigate = useNavigate();
  setNavigate(navigate);

  return (
    <Routes>
      <Route path="/" element={<AppContainer />}>
        <Route index element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/email/verify/:code" element={<VerifyEmail />} />
      <Route path="/password/forgot" element={<ForgetPassword />} />
      <Route path="/password/reset" element={<ResetPassword />} />
    </Routes>
  );
}

export default App;
