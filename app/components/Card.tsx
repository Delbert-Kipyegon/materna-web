import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  isPrime?: boolean
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick, isPrime }) => {
  const baseClasses = `
    bg-white rounded-2xl shadow-sm border border-primary-100 
    transition-all duration-200 hover:shadow-md hover:border-primary-200
    ${onClick ? 'cursor-pointer hover:scale-[1.02]' : ''}
    ${isPrime ? 'ring-2 ring-yellow-400/20' : ''}
    ${className}
  `

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card