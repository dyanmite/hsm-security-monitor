export default function SensorStatusPanel({ systemStatus, alerts = [] }) {
  // Check specific existing alerts (from backend Set)
  const isReedOpen = alerts.includes("ENCLOSURE_OPENED");
  const isLightDetected = alerts.includes("LIGHT_INTRUSION");
  const isMoved = alerts.includes("PHYSICAL_MOVEMENT");

  const sensors =
    systemStatus === "LOCKED"
      ? {
        reed: isReedOpen ? "OPEN" : "CLOSED",
        light: isLightDetected ? "LIGHT DETECTED" : "DARK",
        motion: isMoved ? "MOVED" : "STABLE",
      }
      : {
        reed: "CLOSED",
        light: "DARK",
        motion: "STABLE",
      }

  const sensorStyle = (active) =>
    active
      ? "text-red-400 bg-red-500/10 border-red-500/40"
      : "text-green-400 bg-green-500/10 border-green-500/40"

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {/* 🧲 Reed Sensor */}
      <div
        className={`rounded-xl p-4 border ${sensorStyle(
          sensors.reed !== "CLOSED"
        )}`}
      >
        <p className="text-sm text-gray-300">🧲 Enclosure Sensor</p>
        <p className="text-lg font-bold">{sensors.reed}</p>
      </div>

      {/* 💡 Light Sensor */}
      <div
        className={`rounded-xl p-4 border ${sensorStyle(
          sensors.light !== "DARK"
        )}`}
      >
        <p className="text-sm text-gray-300">💡 Light Sensor</p>
        <p className="text-lg font-bold">{sensors.light}</p>
      </div>

      {/* 🌀 Motion Sensor */}
      <div
        className={`rounded-xl p-4 border ${sensorStyle(
          sensors.motion !== "STABLE"
        )}`}
      >
        <p className="text-sm text-gray-300">🌀 Motion Sensor</p>
        <p className="text-lg font-bold">{sensors.motion}</p>
      </div>
    </div>
  )
}
