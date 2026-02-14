export default function BrandIcon({ size = "md", showText = true }) {
  const sizeMap = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl",
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`
          ${sizeMap[size]}
          rounded-lg
          bg-gradient-to-br from-purple-600 to-cyan-500
          flex items-center justify-center
          font-bold text-white
          shadow-md
        `}
      >
        H
      </div>

      {showText && (
        <span className="font-bold tracking-wide text-white">
          HSM Guard
        </span>
      )}
    </div>
  )
}
