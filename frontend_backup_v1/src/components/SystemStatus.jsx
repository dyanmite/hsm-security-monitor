export default function SystemStatus({ status }) {
  const styles = {
    SAFE: "bg-green-600",
    LOCKED: "bg-red-600",
    ALERT: "bg-yellow-500",
  }

  return (
    <div className={`p-6 rounded-xl mb-6 ${styles[status]}`}>
      <h2 className="text-lg font-semibold">
        System Status
      </h2>
      <p className="text-4xl font-bold mt-2">
        {status}
      </p>
    </div>
  )
}
