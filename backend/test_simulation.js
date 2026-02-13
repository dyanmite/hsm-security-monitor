const fetch = require('node-fetch'); // Assumes node-fetch is available or using built-in fetch in newer node
// If node < 18, we might need to use http or just assume fetch exists

const API_URL = "http://localhost:3000";
const ADMIN_TOKEN = "local-demo-token-12345";

async function runTest() {
    try {
        console.log("1. Triggering Attack...");
        const attackRes = await fetch(`${API_URL}/api/grid/attack`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "VOLTAGE_DROP" })
        });
        console.log("Attack Response:", await attackRes.json());

        console.log("2. Waiting for simulation update (3s)...");
        await new Promise(r => setTimeout(r, 3000));

        console.log("3. Fetching Logs...");
        const logsRes = await fetch(`${API_URL}/logs`, {
            headers: { "Authorization": `Bearer ${ADMIN_TOKEN}` }
        });
        const logs = await logsRes.json();

        if (logs.length > 0) {
            const latest = logs[0];
            console.log("Latest Log:", latest);
            if (latest.event === "GRID_VOLTAGE_COLLAPSE") {
                console.log("✅ SUCCESS: Attack logged correctly.");
            } else {
                console.log("❌ FAILURE: Latest log is not the attack.");
            }
        } else {
            console.log("❌ FAILURE: No logs found.");
        }

    } catch (e) {
        console.error("Test Error:", e);
    }
}

runTest();
