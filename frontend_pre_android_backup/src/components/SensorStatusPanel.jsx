import { Magnet, Lightbulb, Activity, CheckCircle, AlertTriangle } from "lucide-react"

export default function SensorStatusPanel({ systemStatus, alerts = [] }) {
  const isReedOpen = alerts.includes("ENCLOSURE_OPENED");
  const isLightDetected = alerts.includes("LIGHT_INTRUSION");
  const isMoved = alerts.includes("PHYSICAL_MOVEMENT");

  const sensors =
    systemStatus === "LOCKED"
      ? {
        reed: isReedOpen ? "OPEN" : "CLOSED",
        light: isLightDetected ? "DETECTED" : "DARK",
        motion: isMoved ? "MOTION" : "STABLE",
      }
      : {
        reed: "CLOSED",
        light: "DARK",
        motion: "STABLE",
      }

  const getStatusColor = (isTriggered) => isTriggered ? "text-red-400" : "text-green-400";
  const getBgColor = (isTriggered) => isTriggered ? "bg-red-500/10 border-red-500/30" : "bg-emerald-500/10 border-emerald-500/30";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Reed Sensor */}
      <div className={`rounded-2xl p-5 border transition-all duration-300 ${getBgColor(sensors.reed !== "CLOSED")}`}>
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2 rounded-lg ${sensors.reed !== "CLOSED" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
            <Magnet className="w-5 h-5" />
          </div>
          {sensors.reed !== "CLOSED" ? <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
        </div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Enclosure</p>
        <p className={`text-lg font-bold ${getStatusColor(sensors.reed !== "CLOSED")}`}>
          {sensors.reed}
        </p>
      </div>

      {/* Light Sensor */}
      <div className={`rounded-2xl p-5 border transition-all duration-300 ${getBgColor(sensors.light !== "DARK")}`}>
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2 rounded-lg ${sensors.light !== "DARK" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
            <Lightbulb className="w-5 h-5" />
          </div>
          {sensors.light !== "DARK" ? <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
        </div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Light Sensor</p>
        <p className={`text-lg font-bold ${getStatusColor(sensors.light !== "DARK")}`}>
          {sensors.light}
        </p>
      </div>

      {/* Motion Sensor */}
      <div className={`rounded-2xl p-5 border transition-all duration-300 ${getBgColor(sensors.motion !== "STABLE")}`}>
        <div className="flex justify-between items-start mb-2">
          <div className={`p-2 rounded-lg ${sensors.motion !== "STABLE" ? "bg-red-500/20 text-red-400" : "bg-emerald-500/20 text-emerald-400"}`}>
            <Activity className="w-5 h-5" />
          </div>
          {sensors.motion !== "STABLE" ? <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" /> : <CheckCircle className="w-4 h-4 text-emerald-500" />}
        </div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Motion</p>
        <p className={`text-lg font-bold ${getStatusColor(sensors.motion !== "STABLE")}`}>
          {sensors.motion}
        </p>
      </div>
    </div>
  )
}
