'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  User, 
  BookOpen, 
  Users,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Calendar,
  Clock
} from 'lucide-react'

export default function DashboardPage() {
  const { data: session, status } = useSession()
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cyber-dark grid-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }
  
  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'text-neon-pink'
      case 'INSTRUCTOR': return 'text-neon-green'
      case 'STUDENT': return 'text-neon-cyan'
      default: return 'text-gray-400'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Администратор'
      case 'INSTRUCTOR': return 'Преподаватель'
      case 'STUDENT': return 'Студент'
      default: return role
    }
  }

  const getQuickActions = () => {
    const role = session?.user?.role
    
    if (role === 'ADMIN') {
      return [
        { title: 'Управление пользователями', icon: Users, href: '/admin/users', color: 'neon-pink' },
        { title: 'Все курсы', icon: BookOpen, href: '/admin/courses', color: 'neon-pink' },
        { title: 'Статистика', icon: TrendingUp, href: '/admin/analytics', color: 'neon-pink' },
        { title: 'Создать курс', icon: Plus, href: '/courses/create', color: 'neon-green' }
      ]
    } else if (role === 'INSTRUCTOR') {
      return [
        { title: 'Мои курсы', icon: BookOpen, href: '/instructor/courses', color: 'neon-green' },
        { title: 'Создать курс', icon: Plus, href: '/courses/create', color: 'neon-green' },
        { title: 'Студенты', icon: Users, href: '/instructor/students', color: 'neon-cyan' },
        { title: 'Аналитика', icon: TrendingUp, href: '/instructor/analytics', color: 'neon-green' }
      ]
    } else {
      return [
        { title: 'Каталог курсов', icon: BookOpen, href: '/courses', color: 'neon-cyan' },
        { title: 'Мои курсы', icon: User, href: '/student/courses', color: 'neon-cyan' },
        { title: 'Прогресс', icon: TrendingUp, href: '/student/progress', color: 'neon-green' },
        { title: 'Настройки', icon: Edit, href: '/settings', color: 'neon-pink' }
      ]
    }
  }

  const quickActions = getQuickActions()

  return (
    <div className="min-h-screen bg-cyber-dark grid-bg py-12">
      <div className="matrix-rain" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-cyber text-4xl font-bold neon-text mb-4 animate-pulse-neon">
              DASHBOARD
            </h1>
            <p className="text-gray-400 font-mono">
              Добро пожаловать, {session?.user?.name}!
            </p>
            <span className={`inline-block px-3 py-1 text-sm font-cyber uppercase rounded-full mt-2 ${getRoleColor(session?.user?.role || '')} bg-current bg-opacity-20`}>
              {getRoleLabel(session?.user?.role || '')}
            </span>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="neon">
              <CardContent className="p-6 text-center">
                <BookOpen className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
                <div className="text-2xl font-cyber font-bold text-neon-cyan mb-1">
                  0
                </div>
                <div className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                  Курсы
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 text-neon-green mx-auto mb-3" />
                <div className="text-2xl font-cyber font-bold text-neon-green mb-1">
                  0
                </div>
                <div className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                  Студенты
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-neon-pink mx-auto mb-3" />
                <div className="text-2xl font-cyber font-bold text-neon-pink mb-1">
                  0
                </div>
                <div className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                  Часов
                </div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
                <div className="text-2xl font-cyber font-bold text-neon-cyan mb-1">
                  0%
                </div>
                <div className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                  Прогресс
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <span className="neon-text">БЫСТРЫЕ ДЕЙСТВИЯ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <Button 
                    key={index}
                    variant="ghost" 
                    className="h-20 flex flex-col items-center justify-center space-y-2 hover:border-current"
                    onClick={() => window.location.href = action.href}
                  >
                    <action.icon className={`w-6 h-6 text-${action.color}`} />
                    <span className="text-xs text-center font-cyber uppercase tracking-wider">
                      {action.title}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <span className="neon-text-green">ПОСЛЕДНЯЯ АКТИВНОСТЬ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400 font-mono">
                  Пока нет активности
                </p>
                <p className="text-gray-500 font-mono text-sm mt-2">
                  Начните создавать курсы или изучать материалы
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}