'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  loading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  const baseClasses = 'relative overflow-hidden font-cyber font-bold tracking-wider uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    primary: 'bg-transparent border-2 border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-cyber-dark focus:ring-neon-cyan',
    secondary: 'bg-transparent border-2 border-neon-pink text-neon-pink hover:bg-neon-pink hover:text-cyber-dark focus:ring-neon-pink',
    danger: 'bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus:ring-red-500',
    ghost: 'bg-transparent border-2 border-transparent text-gray-400 hover:text-neon-cyan hover:border-neon-cyan focus:ring-neon-cyan'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  const clipPathClasses = {
    sm: 'clip-path-[polygon(0_0,calc(100%-8px)_0,100%_50%,calc(100%-8px)_100%,0_100%,8px_50%)]',
    md: 'clip-path-[polygon(0_0,calc(100%-10px)_0,100%_50%,calc(100%-10px)_100%,0_100%,10px_50%)]',
    lg: 'clip-path-[polygon(0_0,calc(100%-12px)_0,100%_50%,calc(100%-12px)_100%,0_100%,12px_50%)]'
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        'cyber-button',
        loading && 'animate-pulse',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={cn(loading && 'invisible')}>
        {children}
      </span>
      
      {/* Hover effect */}
      <div className="absolute inset-0 bg-current opacity-0 hover:opacity-10 transition-opacity duration-300" />
    </button>
  )
}

export default Button