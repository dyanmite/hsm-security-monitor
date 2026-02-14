import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function TamperGraph({ logs = [] }) {
  // Generate last 5 minutes as buckets
  const now = new Date();
  const data = [];

  for (let i = 4; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60000); // i minutes ago
    // Format "HH:mm" (IST already from logs, but here we generate local time labels)
    const hours = t.getHours().toString().padStart(2, '0');
    const mins = t.getMinutes().toString().padStart(2, '0');
    const timeLabel = `${hours}:${mins}`;

    // Count logs that match this timeLabel
    // Log time format from backend is "YYYY-MM-DD HH:mm:ss"
    const count = logs.filter(l => {
      if (!l.time) return false;
      // Extract HH:mm from log time string
      // "2026-02-03 12:30:21" -> substring(11, 16) -> "12:30"
      const logTimePart = l.time.substring(11, 16);
      return logTimePart === timeLabel;
    }).length;

    data.push({ time: timeLabel, events: count });
  }
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg shadow-black/20">
      <h3 className="text-lg font-semibold mb-4">
        Tamper Activity Timeline
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#020617",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "white",
            }}
          />
          <Line
            type="natural"
            dataKey="events"
            stroke="#a855f7"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
