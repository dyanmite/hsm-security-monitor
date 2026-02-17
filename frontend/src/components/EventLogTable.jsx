import { FileDown, Clock, Activity, CheckCircle, AlertOctagon, Link, FileSearch } from "lucide-react"

export default function EventLogTable({ logs = [] }) {
  const downloadReport = () => {
    const headers = ["Time (IST)", "Event", "Status", "Hash", "Previous Hash", "Chain Valid?"];
    const rows = logs.map(log => {
      return [
        log.time,
        log.event,
        log.status,
        log.hash || "N/A",
        log.prevHash || "GENESIS",
        "See Hash"
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.reverse().join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `HSM_Forensic_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-blue-400" />
          Tamper Event Log
        </h3>
        <button
          onClick={downloadReport}
          className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs px-4 py-2 rounded-lg transition border border-white/10 flex items-center gap-2 font-medium"
        >
          <FileDown className="w-4 h-4" /> Download Report
        </button>
      </div>

      <div className="max-h-[350px] overflow-y-auto overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[500px]">
          <thead className="sticky top-0 bg-slate-900 text-slate-400 text-xs uppercase tracking-wider font-semibold z-10 shadow-sm">
            <tr>
              <th className="py-3 pl-4 border-b border-white/5">Time</th>
              <th className="py-3 border-b border-white/5">Integrity</th>
              <th className="py-3 border-b border-white/5">Event</th>
              <th className="py-3 border-b border-white/5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm text-slate-300">
            {logs.length === 0 ? (
              <tr><td colSpan="4" className="py-8 text-center text-slate-500 italic">No events recorded</td></tr>
            ) : [...logs].reverse().map((log, i, arr) => {
              const nextLog = arr[i + 1];
              const isGenesis = !nextLog;
              const isChainValid = isGenesis || (log.prevHash === nextLog.hash);

              const statusColor =
                log.status === "LOCKED"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"

              return (
                <tr
                  key={i}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="py-3 pl-4 font-mono text-xs text-slate-400 flex items-center gap-2">
                    <Clock className="w-3 h-3 opacity-50" />
                    {log.time ? log.time.replace("T", " ").split(".")[0] : "Unknown"}
                  </td>
                  <td className="py-3">
                    <div className="relative flex items-center">
                      {isChainValid ? (
                        <div className="flex items-center gap-1.5 text-emerald-500 text-xs font-medium bg-emerald-500/5 px-2 py-1 rounded">
                          <Link className="w-3 h-3" /> Valid
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium bg-red-500/5 px-2 py-1 rounded animate-pulse">
                          <AlertOctagon className="w-3 h-3" /> Broken
                        </div>
                      )}

                      {/* Tooltip */}
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-black p-4 rounded-lg border border-white/10 z-50 shadow-2xl min-w-[320px]">
                        <div className="text-[10px] uppercase text-slate-500 font-bold mb-2 tracking-widest">Forensic Hash Data</div>

                        <div className="mb-3">
                          <div className="text-xs text-slate-400 mb-1">Current Hash (SHA-256)</div>
                          <div className={`font-mono text-[10px] break-all p-1.5 rounded bg-white/5 ${isChainValid ? "text-emerald-400" : "text-red-400"}`}>
                            {log.hash || "MISSING"}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs text-slate-400 mb-1">Previous Hash Link</div>
                          <div className="font-mono text-[10px] break-all p-1.5 rounded bg-white/5 text-slate-500">
                            {log.prevHash || "GENESIS_BLOCK"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-medium text-white">{log.event}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] rounded-full border font-bold tracking-wide uppercase ${statusColor}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${log.status === "LOCKED" ? "bg-red-500" : "bg-emerald-500"}`} />
                      {log.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
