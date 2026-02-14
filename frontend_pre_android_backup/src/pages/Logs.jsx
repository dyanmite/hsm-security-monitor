import { useEffect, useState } from "react"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import EventLogTable from "../components/EventLogTable"
import { apiGet } from "../api"

export default function Logs() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    async function fetchLogs() {
      try {
        const res = await apiGet("/logs")
        if (Array.isArray(res)) {
          setLogs(res.reverse())
        }
      } catch (err) {
        console.error("Failed to load logs", err)
      }
    }

    fetchLogs()
    // Poll every 5 seconds to keep it fresh
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6">
        <Header />

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4 text-slate-300">Full Tamper History</h2>
          <EventLogTable logs={logs} />
        </div>
      </div>
    </div>
  )
}
