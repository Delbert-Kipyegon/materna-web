import React from 'react'
import { Crown } from 'lucide-react'

interface PrimeBadgeProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const PrimeBadge: React.FC<PrimeBadgeProps> = ({ size = 'sm', className = '' }) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  return (
    <div className={`
      inline-flex items-center space-x-1 rounded-full 
      bg-gradient-to-r from-yellow-400 to-orange-500 
      text-white font-semibold relative overflow-hidden
      ${sizeClasses[size]} ${className}
    `}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      translate-x-[-100%] animate-shimmer" />
      <Crown className={iconSizes[size]} />
      <span>Prime</span>
    </div>
  )
}

export default PrimeBadge