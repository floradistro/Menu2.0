interface ErrorMessageProps {
  error: string
  fullScreen?: boolean
  title?: string
}

export function ErrorMessage({ error, fullScreen = true, title = "Error" }: ErrorMessageProps) {
  const containerClass = fullScreen 
    ? "flex items-center justify-center min-h-screen" 
    : "bg-red-900/20 border border-red-500/30 rounded-lg p-4"

  if (fullScreen) {
    return (
      <div className={containerClass}>
        <div className="text-center">
          <div className="text-red-400 text-2xl mb-2">⚠️ {title}</div>
          <div className="text-red-300">{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={containerClass}>
      <h3 className="text-red-400 font-medium mb-2">⚠️ {title}</h3>
      <div className="text-red-300">{error}</div>
    </div>
  )
} 