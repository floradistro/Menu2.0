interface LoadingSpinnerProps {
  message?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ message = "Loading...", fullScreen = true }: LoadingSpinnerProps) {
  const containerClass = fullScreen 
    ? "flex items-center justify-center min-h-screen" 
    : "flex items-center justify-center p-8"

  return (
    <div className={containerClass}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-400 mx-auto mb-4"></div>
        <div className="text-gray-400 text-xl">{message}</div>
      </div>
    </div>
  )
} 