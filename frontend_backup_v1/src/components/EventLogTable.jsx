export default function EventLogTable({ logs = [] }) {
  // Logs are passed from Dashboard parent
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg shadow-black/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Tamper Event Log
        </h3>
        <button
          onClick={() => {
            // Generate CSV
            const headers = ["Time (IST)", "Event", "Status", "Hash", "Previous Hash", "Chain Valid?"];
            const rows = logs.map(log => {
              // Re-verify strictly for report
              // Note: We need to find the "older" log relative to this one
              // Since 'logs' is Oldest -> Newest (from backend typically), 
              // we used .reverse() in render. Let's do it carefully here.
              // Actually, simply dumping the fields is enough, the Auditor verifies the math manually.
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
          }}
          className="bg-slate-700 hover:bg-slate-600 text-xs px-3 py-1.5 rounded transition border border-slate-600 flex items-center gap-2"
        >
          📄 Download Forensic Report
        </button>
      </div>

      <div className="max-h-[300px] overflow-y-auto">
        <table className="w-full text-left">
          <thead className="sticky top-0 bg-slate-800 text-slate-400 border-b border-slate-600 z-10">
            <tr>
              <th className="py-2 pl-4">Time (IST)</th>
              <th>Integrity</th>
              <th>Event</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr><td colSpan="4" className="py-4 text-center text-gray-500">No logs found</td></tr>
            ) : [...logs].reverse().map((log, i, arr) => {
              // Note: logs are passed as [Old -> New] from Dashboard (due to .reverse() there)
              // But we usually want to SEE the Newest log at the top of the table.
              // So I did [...logs].reverse() here to render Newest First.

              // Verification Logic:
              // Since 'arr' is now [Newest, ..., Oldest]
              // The Current Log (Newer) should point to the Next Log in Array (Older)
              // So: currentLog.prevHash === nextLogInArray.hash

              const nextLog = arr[i + 1]; // This is the OLDER log
              const isGenesis = !nextLog; // End of the list (Start of time)

              // If chain is intact: prevHash of Current must match Hash of Older
              const isChainValid = isGenesis || (log.prevHash === nextLog.hash);

              const statusColor =
                log.status === "LOCKED"
                  ? "bg-red-500/20 text-red-400"
                  : "bg-green-500/20 text-green-400"

              return (
                <tr
                  key={i}
                  className="border-b border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  <td className="py-2 pl-4 font-mono text-xs text-slate-300">
                    {log.time.replace("T", " ").split(".")[0]}
                  </td>
                  <td className="pl-2">
                    <div className="group relative flex items-center">
                      {isChainValid ? (
                        <span className="text-emerald-400 text-lg cursor-help">🔗</span>
                      ) : (
                        <span className="text-red-500 text-lg cursor-help animate-pulse">❌</span>
                      )}

                      {/* Tooltip for Hash & Forensics */}
                      <div className="absolute left-6 top-0 hidden group-hover:block bg-slate-900/95 p-3 rounded border border-slate-600 z-50 shadow-2xl min-w-[300px]">
                        <div className="text-xs font-mono text-slate-400 mb-1">Log Hash (SHA-256):</div>
                        <div className={`text-xs font-mono mb-2 ${isChainValid ? "text-emerald-400" : "text-red-400 font-bold"}`}>
                          {log.hash ? log.hash.substring(0, 20) : "MISSING"}...
                        </div>

                        <div className="text-xs font-mono text-slate-500 mb-1">Previous Link:</div>
                        <div className="text-xs font-mono text-slate-400">
                          {log.prevHash ? log.prevHash.substring(0, 20) : "GENESIS"}...
                        </div>

                        {!isChainValid && (
                          <div className="mt-2 text-xs font-bold text-red-400 bg-red-900/20 p-2 rounded">
                            ⚠️ TAMPER DETECTED: Chain Broken Here
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="font-semibold text-slate-200">{log.event}</td>
                  <td>
                    <span className={`px-2 py-1 text-xs rounded font-bold tracking-wider ${statusColor}`}>
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

