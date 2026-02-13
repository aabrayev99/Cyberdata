'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  User, 
  Mail, 
  Shield, 
  Calendar,
  Settings,
  BookOpen,
  Trophy,
  Clock
} from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
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
  
  const user = session?.user
  
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
  
  return (
    <div className="min-h-screen bg-cyber-dark grid-bg py-12">
      <div className="matrix-rain" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-cyber text-4xl font-bold neon-text mb-4 animate-pulse-neon">
              ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
            </h1>
            <p className="text-gray-400 font-mono">
              Добро пожаловать в систему, {user?.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Info Card */}
            <div className="lg:col-span-1">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="text-center">
                    <span className="glitch" data-text="ИНФОРМАЦИЯ">
                      ИНФОРМАЦИЯ
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-6">
                    {/* Avatar */}
                    <div className="w-24 h-24 bg-cyber-gray border-2 border-neon-cyan rounded-full flex items-center justify-center mx-auto animate-glow">
                      {user?.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name || ''} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-neon-cyan" />
                      )}
                    </div>
                    
                    {/* User Details */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 justify-center">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="font-cyber text-white">{user?.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 justify-center">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-gray-300 text-sm">{user?.email}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3 justify-center">
                        <Shield className="w-4 h-4 text-gray-400" />
                        <span className={`font-cyber text-sm uppercase tracking-wider ${getRoleColor(user?.role || '')}`}>
                          {getRoleLabel(user?.role || '')}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 justify-center">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="font-mono text-gray-300 text-sm">
                          Участник с 2026
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="w-full"
                      onClick={() => router.push('/settings')}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Редактировать профиль
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Stats and Activity */}
            <div className="lg:col-span-2 space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card variant="neon">
                  <CardContent className="p-6 text-center">
                    <BookOpen className="w-8 h-8 text-neon-cyan mx-auto mb-3" />
                    <div className="text-2xl font-cyber font-bold text-neon-cyan mb-1">
                      5
                    </div>
                    <div className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                      Активные курсы
                    </div>
                  </CardContent>
                </Card>
                
                <Card variant="glass">
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-8 h-8 text-neon-green mx-auto mb-3" />
                    <div className="text-2xl font-cyber font-bold text-neon-green mb-1">
                      12
                    </div>
                    <div className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                      Завершено курсов
                    </div>
                  </CardContent>
                </Card>
                
                <Card variant="glass">
                  <CardContent className="p-6 text-center">
                    <Clock className="w-8 h-8 text-neon-pink mx-auto mb-3" />
                    <div className="text-2xl font-cyber font-bold text-neon-pink mb-1">
                      48
                    </div>
                    <div className="text-sm text-gray-400 font-mono uppercase tracking-wider">
                      Часов обучения
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Activity */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>
                    <span className="neon-text-green">ПОСЛЕДНЯЯ АКТИВНОСТЬ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: 'Завершен урок',
                        course: 'Python для анализа данных',
                        time: '2 часа назад',
                        type: 'success'
                      },
                      {
                        action: 'Начат курс',
                        course: 'Машинное обучение с Scikit-learn',
                        time: '1 день назад',
                        type: 'info'
                      },
                      {
                        action: 'Получен сертификат',
                        course: 'Основы SQL',
                        time: '3 дня назад',
                        type: 'achievement'
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-cyber-gray/30 border border-cyber-light-gray">
                        <div className={`w-3 h-3 rounded-full animate-pulse ${
                          activity.type === 'success' ? 'bg-neon-green' :
                          activity.type === 'info' ? 'bg-neon-cyan' :
                          'bg-neon-pink'
                        }`} />
                        <div className="flex-1">
                          <div className="text-white font-mono text-sm">
                            <span className="text-neon-cyan">{activity.action}</span>
                            {': '}
                            <span className="text-gray-300">{activity.course}</span>
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-1">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Quick Actions */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle>
                <span className="neon-text">БЫСТРЫЕ ДЕЙСТВИЯ</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="primary" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Мои курсы
                </Button>
                <Button variant="secondary" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  Достижения
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={() => router.push('/settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Настройки
                </Button>
                <Button variant="ghost" className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Расписание
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}