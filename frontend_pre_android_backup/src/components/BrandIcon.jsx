export default function BrandIcon({ size = "md", showText = true }) {
  const sizeMap = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-lg",
    lg: "w-12 h-12 text-xl",
  }

  return (
    <div className="flex items-center gap-3">
      <img
        src="/hsm-logo.png"
        alt="Logo"
        className={`${sizeMap[size].split(' ')[0]} ${sizeMap[size].split(' ')[1]} object-contain drop-shadow-md`}
      />

      {showText && (
        <span className="font-bold tracking-wide text-white">
          HSM Guard
        </span>
      )}
    </div>
  )
}
