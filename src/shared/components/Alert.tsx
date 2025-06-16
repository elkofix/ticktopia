export const Alert = ({
  children,
  variant = 'error',
  className = ''
}: {
  children: React.ReactNode
  variant?: 'error' | 'success'
  className?: string
}) => {
  const variantClasses = {
    error: 'bg-red-100 text-red-700',
    success: 'bg-green-100 text-green-700'
  }
  
  return (
    <div className={`p-3 rounded ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}