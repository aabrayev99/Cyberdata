'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import Button from './Button'
import { 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  Home, 
  PlusCircle,
  BarChart3 
} from 'lucide-react'

export const Navbar: React.FC = () => {
  const { data: session, status } = useSession()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  
  const navigation = [
    { name: 'Главная', href: '/', icon: Home },
    { name: 'Курсы', href: '/courses', icon: BookOpen },
  ]
  
  const userNavigation = session?.user ? [
    ...(session.user.role === 'ADMIN' || session.user.role === 'INSTRUCTOR' ? [
      { name: 'Создать курс', href: '/courses/create', icon: PlusCircle },
      { name: 'Дашборд', href: '/dashboard', icon: BarChart3 },
    ] : []),
    { name: 'Профиль', href: '/profile', icon: User },
    { name: 'Настройки', href: '/settings', icon: Settings },
  ] : []
  
  return (
    <nav className="bg-cyber-darker/95 backdrop-blur-md border-b border-cyber-light-gray sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-neon-gradient rounded-md flex items-center justify-center">
              <span className="text-cyber-dark font-bold text-sm">DA</span>
            </div>
            <span className="font-cyber text-xl font-bold neon-text tracking-wider">
              DATA ANALYTICS
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 text-gray-300 hover:text-neon-cyan transition-colors duration-200 font-cyber tracking-wider uppercase text-sm"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
          
          {/* User menu */}
          <div className="flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-neon-cyan transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-cyber-gray border border-neon-cyan rounded-full flex items-center justify-center">
                    {session.user.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || ''} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="font-cyber text-sm tracking-wider">
                    {session.user.name}
                  </span>
                </button>
                
                {/* Dropdown menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-cyber-gray border border-cyber-light-gray rounded-lg shadow-lg overflow-hidden z-50">
                    <div className="py-2">
                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:bg-cyber-light-gray hover:text-neon-cyan transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <item.icon className="w-4 h-4" />
                          <span className="font-cyber tracking-wider">{item.name}</span>
                        </Link>
                      ))}
                      <hr className="my-2 border-cyber-light-gray" />
                      <button
                        onClick={() => {
                          signOut()
                          setIsMenuOpen(false)
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-red-400 hover:bg-cyber-light-gray hover:text-red-300 transition-colors duration-200 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="font-cyber tracking-wider">Выйти</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Войти
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" size="sm">
                    Регистрация
                  </Button>
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-neon-cyan transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-cyber-gray border-t border-cyber-light-gray">
          <div className="px-4 py-2 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2 text-gray-300 hover:bg-cyber-light-gray hover:text-neon-cyan transition-colors duration-200 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span className="font-cyber tracking-wider text-sm">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar