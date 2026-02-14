import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { Activity } from "lucide-react"

export default function TamperGraph({ logs = [] }) {
  const now = new Date();
  const data = [];

  for (let i = 4; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 60000);
    const hours = t.getHours().toString().padStart(2, '0');
    const mins = t.getMinutes().toString().padStart(2, '0');
    const timeLabel = `${hours}:${mins}`;

    const count = logs.filter(l => {
      if (!l.time) return false;
      const logTimePart = l.time.substring(11, 16);
      return logTimePart === timeLabel;
    }).length;

    data.push({ time: timeLabel, events: count });
  }
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
      <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        Tamper Activity Timeline
      </h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
            <XAxis
              dataKey="time"
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15, 23, 42, 0.9)",
                borderColor: "rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "white",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
              }}
              itemStyle={{ color: "#a855f7" }}
              cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
            />
            <Line
              type="monotone"
              dataKey="events"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, fill: "#8b5cf6", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, fill: "#fff", stroke: "#8b5cf6" }}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
