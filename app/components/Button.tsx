import React from 'react'
import { DivideIcon as LucideIcon } from 'lucide-react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: typeof LucideIcon
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit'
}

function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className = '',
  type = 'button',
}: ButtonProps) {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500/40'

  const variantClasses = {
    primary:
      'bg-zinc-900 text-white hover:bg-zinc-800 shadow-md shadow-zinc-900/10',
    secondary:
      'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:opacity-95 shadow-md shadow-violet-500/20',
    outline:
      'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 hover:border-zinc-400',
    ghost: 'text-zinc-700 hover:bg-zinc-100',
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3 text-base',
  }

  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
    >
      {Icon && (
        <Icon
          className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} ${children ? 'mr-2' : ''}`}
        />
      )}
      {children}
    </button>
  )
}

export default Button
