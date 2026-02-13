'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className,
  ...props
}) => {
  const inputId = React.useId()
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-neon-cyan font-cyber tracking-wider uppercase"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          className={cn(
            'cyber-input w-full',
            icon && 'pl-10',
            error && 'border-red-500 focus:border-red-500',
            className
          )}
          {...props}
        />
        
        {/* Scan line animation */}
        <div className="absolute inset-x-0 top-0 h-px bg-neon-cyan opacity-0 animate-pulse pointer-events-none" />
      </div>
      
      {error && (
        <p className="text-sm text-red-400 font-mono animate-pulse-neon">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input