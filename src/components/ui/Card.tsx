'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'neon'
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const variantClasses = {
    default: 'cyber-card',
    glass: 'glass',
    neon: 'border-2 border-neon-cyan bg-cyber-gray/50 animate-glow'
  }
  
  return (
    <div
      className={cn(
        'rounded-lg p-6 transition-all duration-300',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn('pb-4 border-b border-cyber-light-gray', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3 
      className={cn('font-cyber text-xl font-bold text-neon-cyan uppercase tracking-wider', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn('pt-4 text-gray-300', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div 
      className={cn('pt-4 border-t border-cyber-light-gray', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card