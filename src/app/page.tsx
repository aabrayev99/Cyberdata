'use client'

import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  BarChart3, 
  Brain, 
  Code, 
  Database, 
  TrendingUp, 
  Users,
  Zap,
  ArrowRight,
  PlayCircle
} from 'lucide-react'

export default function Home() {
  const { data: session } = useSession()
  
  const features = [
    {
      icon: Database,
      title: 'Базы данных',
      description: 'Изучите SQL, NoSQL и современные системы хранения'
    },
    {
      icon: BarChart3,
      title: 'Визуализация',
      description: 'Мастерство создания дашбордов и аналитических отчётов'
    },
    {
      icon: Brain,
      title: 'Машинное обучение',
      description: 'Постройте предиктивные модели с Python и R'
    },
    {
      icon: Code,
      title: 'Программирование',
      description: 'Python, R, Scala для анализа больших данных'
    }
  ]
  
  const stats = [
    { number: '500+', label: 'Курсов' },
    { number: '50K+', label: 'Студентов' },
    { number: '100+', label: 'Преподавателей' },
    { number: '95%', label: 'Отличные оценки' }
  ]
  
  return (
    <div className="bg-cyber-dark min-h-screen grid-bg overflow-hidden relative">
      {/* Matrix rain background */}
      <div className="matrix-rain" />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="font-cyber text-6xl md:text-8xl font-bold">
              <span className="neon-text animate-pulse-neon">
                DATA 
              </span>
              <span className="neon-text-pink animate-flicker">
                ANALYTICS
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 font-mono max-w-3xl mx-auto leading-relaxed">
              Погрузитесь в мир анализа данных и машинного обучения.
              <span className="text-neon-cyan">
                {' '}Овладейте навыками будущего
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {!session ? (
                <>
                  <Link href="/auth/signup">
                    <Button variant="primary" size="lg" className="min-w-[200px]">
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Начать обучение
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button variant="ghost" size="lg" className="min-w-[200px]">
                      Просмотреть курсы
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/courses">
                    <Button variant="primary" size="lg" className="min-w-[200px]">
                      <PlayCircle className="w-5 h-5 mr-2" />
                      Продолжить обучение
                    </Button>
                  </Link>
                  <Link href="/profile">
                    <Button variant="secondary" size="lg" className="min-w-[200px]">
                      <Users className="w-5 h-5 mr-2" />
                      Мой профиль
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-cyber text-4xl font-bold neon-text-green mb-4 animate-pulse-neon">
              ЧТО ВЫ ИЗУЧИТЕ
            </h2>
            <p className="text-gray-400 font-mono text-lg">
              Комплексная программа обучения от новичка до эксперта
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} variant="glass" className="hover:border-neon-cyan transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <feature.icon className="w-12 h-12 text-neon-cyan mx-auto mb-4 group-hover:animate-pulse" />
                  <h3 className="font-cyber text-lg font-bold text-neon-cyan mb-3 uppercase tracking-wider">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-mono leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-20 bg-cyber-gray/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-6xl font-cyber font-bold neon-text-pink animate-pulse-neon mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-mono uppercase tracking-wider text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card variant="neon" className="p-12">
            <CardHeader>
              <CardTitle className="text-4xl mb-4">
                <span className="glitch" data-text="ГОТОВЫ НАЧАТЬ?">
                  ГОТОВЫ НАЧАТЬ?
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl text-gray-300 font-mono mb-8 leading-relaxed">
                Присоединяйтесь к сообществу аналитиков данных и откройте новые карьерные возможности
              </p>
              
              {!session ? (
                <div className="space-y-4">
                  <Link href="/auth/signup">
                    <Button variant="primary" size="lg" className="min-w-[250px]">
                      <Zap className="w-5 h-5 mr-2" />
                      Создать аккаунт
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-500 font-mono">
                    Бесплатная регистрация - начните сегодня
                  </p>
                </div>
              ) : (
                <Link href="/courses">
                  <Button variant="primary" size="lg" className="min-w-[250px]">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Продолжить обучение
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}