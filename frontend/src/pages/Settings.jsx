import { useState, useEffect } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import { apiGet, apiPost } from "../api"

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    recipient: "",
    sender: "",
    appPassword: ""
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await apiGet("/settings/email");
      setFormData({
        recipient: data.recipient || "",
        sender: data.sender || "",
        appPassword: "" // Don't show password
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setMsg("Saving...");

    // Only send password if it was entered
    const payload = {
      recipient: formData.recipient,
      sender: formData.sender
    };
    if (formData.appPassword) {
      payload.appPassword = formData.appPassword;
    }

    try {
      const res = await apiPost("/settings/email", payload);
      if (res.success) {
        setMsg("Settings saved! A test email has been sent.");
        setFormData(prev => ({ ...prev, appPassword: "" }));
      } else {
        setMsg("Error saving settings.");
      }
    } catch (err) {
      setMsg("Failed to save.");
    }
  }

  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header />

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-2xl">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            📧 Email Alert Configuration
          </h2>

          <p className="text-slate-400 text-sm mb-6">
            Configure Gmail SMTP settings to receive security alerts (e.g. System Locked, Zeroized).
            You will need a <strong>Gmail App Password</strong>.
          </p>

          {loading ? (
            <div className="text-slate-500">Loading settings...</div>
          ) : (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Alert Recipient Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="admin@example.com"
                  value={formData.recipient}
                  onChange={e => setFormData({ ...formData, recipient: e.target.value })}
                />
              </div>

              <div className="pt-4 border-t border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Sender Configuration (Gmail)</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Your Gmail Address</label>
                    <input
                      type="email"
                      required
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="alerts@gmail.com"
                      value={formData.sender}
                      onChange={e => setFormData({ ...formData, sender: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-1">App Password</label>
                    <input
                      type="password"
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={formData.appPassword ? "••••••••••••••••" : "Enter new App Password to update"}
                      value={formData.appPassword}
                      onChange={e => setFormData({ ...formData, appPassword: e.target.value })}
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Go to Google Account {'>'} Security {'>'} 2-Step Verification {'>'} App Passwords.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded transition-colors"
                >
                  Save & Test Alert
                </button>
                {msg && (
                  <span className={`ml-4 text-sm ${msg.includes("Error") || msg.includes("Failed") ? "text-red-400" : "text-green-400"}`}>
                    {msg}
                  </span>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
