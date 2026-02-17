import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
import { App as CapApp } from '@capacitor/app';
// REMOVED: import { onAuthStateChanged } from "firebase/auth";
// REMOVED: import { auth } from "./firebase";

import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Otp from "./pages/Otp"
import Dashboard from "./pages/Dashboard"
import Logs from "./pages/Logs"
import Settings from "./pages/Settings"
import Compliance from "./pages/Compliance"

export default function App() {
  const [user, setUser] = useState(null);

  // Disable right-click context menu
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);

    // Auth Listener (LOCAL)
    const token = localStorage.getItem("hsm_token");
    if (token) {
      setUser({ email: "admin@local.host" }); // Mock User
    } else {
      setUser(null);
    }

    /* ===========================
       🔹 HARDWARE BACK BUTTON
    =========================== */
    let backListener;
    const setupBack = async () => {
      backListener = await CapApp.addListener('backButton', ({ canGoBack }) => {
        if (window.history.length > 1 && document.location.pathname !== "/" && document.location.pathname !== "/dashboard" && document.location.pathname !== "/login") {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      });
    };
    setupBack();

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      if (backListener) backListener.remove();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        {/* Protected Routes could be wrapped here, but for now we rely on Backend check + Redirect */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/compliance" element={<Compliance />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}



