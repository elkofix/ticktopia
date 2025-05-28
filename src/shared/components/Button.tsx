export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  
  const getVariantClass = () => {
    switch (variant) {
      case 'primary':
        return 'btn-primary'
      case 'secondary':
        return 'btn-secondary'
      case 'danger':
        return 'btn-danger'
      default:
        return 'btn-primary'
    }
  }
  
  return (
    <button
      className={`btn ${getVariantClass()} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}