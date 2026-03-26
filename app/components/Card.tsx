import React from 'react'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

function Card({ children, className = '', onClick }: CardProps) {
  const base = `
    rounded-2xl border border-zinc-200/80 bg-white shadow-sm shadow-zinc-900/[0.04]
    transition-all duration-200
    ${onClick ? 'cursor-pointer hover:border-zinc-300 hover:shadow-md' : ''}
    ${className}
  `
  return (
    <div className={base.trim()} onClick={onClick}>
      {children}
    </div>
  )
}

export default Card
