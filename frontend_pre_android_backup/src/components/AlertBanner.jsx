export default function AlertBanner({ event }) {
  if (!event) return null

  return (
    <div className="bg-red-700 border border-red-400 p-4 rounded-xl mb-6">
      <h3 className="font-bold text-lg">🚨 TAMPER DETECTED</h3>
      <p className="mt-1">Event: {event.type}</p>
      <p>Time: {event.time}</p>
      <p>Status: {event.status}</p>
    </div>
  )
}
