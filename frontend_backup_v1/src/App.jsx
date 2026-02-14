import { BrowserRouter, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"
// REMOVED: import { onAuthStateChanged } from "firebase/auth";
// REMOVED: import { auth } from "./firebase";

import Login from "./pages/Login"
import Otp from "./pages/Otp"
import Dashboard from "./pages/Dashboard"
import Logs from "./pages/Logs"
import Settings from "./pages/Settings"

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

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<Otp />} />
        {/* Protected Routes could be wrapped here, but for now we rely on Backend check + Redirect */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  )
}



