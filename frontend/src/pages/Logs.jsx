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

  // Verification Logic
  const [verifying, setVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null); // null, "valid", "invalid"
  const [invalidIndices, setInvalidIndices] = useState([]);

  async function verifyChain() {
    setVerifying(true);
    setVerificationStatus(null);
    setInvalidIndices([]);

    // Verification Logic:
    // 1. Server returns logs as [Newest, ..., Oldest]
    // 2. We reverse them on load: setLogs(res.reverse()) -> [Oldest, ..., Newest]
    // 3. The Hash Chain is built Oldest -> Newest (Genesis -> Latest)
    // 4. So we iterate i = 0 to length (Oldest -> Newest) verifying each link.

    let simulatedLastHash = "0000000000000000000000000000000000000000000000000000000000000000";
    let broken = false;
    let badIndices = [];

    // logs state is setLogs(res.reverse()) in fetching.
    // server returns [Newest, ..., Oldest] (localLogs).
    // res.reverse() makes it [Oldest, ..., Newest].
    // So logs[0] is OLDEST. logs[length-1] is NEWEST.

    // WAIT! Let's re-read Logs.jsx:15 -> setLogs(res.reverse())
    // If server returns [Newest, Oldest]
    // Then logs state IS [Oldest, Newest]

    // So logs[0] IS the Oldest.
    // logs[0].prevHash SHOULD be 000...000

    // So iterating i = 0 to length (Oldest -> Newest) IS CORRECT!

    // BUT! I must make sure the server ACTUALLY returns [Newest...Oldest].
    // server.js:302 -> res.json(localLogs).
    // server.js:166 -> localLogs.unshift(newLog).
    // So yes, server returns [Newest, ..., Oldest].

    // Logs.jsx:15 -> setLogs(res.reverse()). 
    // So logs state is [Oldest, ..., Newest].

    // My previous comment in code was confusing/wrong. 
    // "logs" state is [Oldest, Newest].
    // loop 0..length is Oldest..Newest.

    // Let's verify the logic inside the loop.
    // i=0 (Oldest). prevHash check against 0000..000.
    // calcHash = sha256(... + prevHash).
    // simulatedLastHash = calcHash.
    // i=1. prevHash check against simulatedLastHash (which is Hash(Log 0)).

    // THIS LOGIC IS CORRECT.
    // However, I will add a comment to clarify this confusing reverse-reverse situation.

    for (let i = 0; i < logs.length; i++) {
      const log = logs[i];

      // 1. Check if log points to the correct previous hash
      if (log.prevHash !== simulatedLastHash) {
        console.error(`Hash mismatch at index ${i}`, log.prevHash, simulatedLastHash);
        broken = true;
        badIndices.push(i);
      }

      // 2. Calculate what THIS log's hash should be
      const dataToHash = log.time + log.event + log.status + log.prevHash;
      const calcHash = await sha256(dataToHash);

      // 3. Check if stored hash matches calculated
      if (calcHash !== log.hash) {
        console.error(`Integrity Check Failed at index ${i}: stored=${log.hash}, calc=${calcHash}`);
        broken = true;
        badIndices.push(i);
      }

      // Update for next iteration
      simulatedLastHash = calcHash;
    }

    setInvalidIndices(badIndices);
    setVerificationStatus(broken ? "invalid" : "valid");
    setVerifying(false);
  }

  return (
    <div className="flex bg-slate-900 text-white min-h-screen">
      <Sidebar />

      <div className="flex-1 p-6 overflow-y-auto">
        <Header />

        <div className="mt-8 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-slate-300">Forensic Audit Trail</h2>

            <button
              onClick={verifyChain}
              disabled={verifying}
              className={`px-4 py-2 rounded font-bold transition-all flex items-center gap-2 ${verificationStatus === "valid" ? "bg-green-500/20 text-green-400 border border-green-500/50" :
                verificationStatus === "invalid" ? "bg-red-500/20 text-red-400 border border-red-500/50" :
                  "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
            >
              {verifying ? "Verifying Crypto Chain..." :
                verificationStatus === "valid" ? "✅ Chain Verified (Immutable)" :
                  verificationStatus === "invalid" ? "❌ TAMPER DETECTED" :
                    "🛡️ Verify Hash Chain"}
            </button>
          </div>

          {verificationStatus === "valid" && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">
              <strong>Cryptographic Proof:</strong> All {logs.length} logs are linked via SHA-256 hash pointers. No data has been altered since creation.
            </div>
          )}

          {verificationStatus === "invalid" && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              <strong>CRITICAL WARNING:</strong> The hash chain is broken. Database has been manually tampered with!
            </div>
          )}

          <EventLogTable logs={logs} highlightInvalid={invalidIndices} />
        </div>
      </div>
    </div>
  )
}

// Simple SHA-256 for browser
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
