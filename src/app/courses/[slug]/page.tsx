'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  ArrowLeft,
  BookOpen,
  Clock,
  User,
  Edit,
  Play,
  Users,
  Star,
  Calendar
} from 'lucide-react'

export default function CourseDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  
  const [course, setCourse] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState('')

  // Load course data
  React.useEffect(() => {
    const loadCourse = async () => {
      if (!slug) return
      
      try {
        setLoading(true)
        const response = await fetch(`/api/courses/${slug}`)
        
        if (response.ok) {
          const data = await response.json()
          setCourse(data.course)
        } else {
          setError('Курс не найден')
        }
      } catch (error) {
        setError('Ошибка загрузки курса')
        console.error('Error loading course:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [slug])

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'text-neon-green'
      case 'INTERMEDIATE': return 'text-neon-cyan'
      case 'ADVANCED': return 'text-neon-pink'
      default: return 'text-gray-400'
    }
  }
  
  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'BEGINNER': return 'Начальный'
      case 'INTERMEDIATE': return 'Средний'
      case 'ADVANCED': return 'Продвинутый'
      default: return level
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cyber-dark grid-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-cyber-dark grid-bg flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h2 className="font-cyber text-2xl text-gray-400 mb-2">{error || 'Курс не найден'}</h2>
          <Button variant="ghost" onClick={() => router.push('/courses')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Вернуться к каталогу
          </Button>
        </div>
      </div>
    )
  }

  const canEdit = session?.user && (
    session.user.role === 'ADMIN' || 
    session.user.id === course.instructorId
  )

  return (
    <div className="min-h-screen bg-cyber-dark grid-bg py-12">
      <div className="matrix-rain" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/courses')}
              className="flex items-center space-x-2 text-gray-400 hover:text-neon-cyan transition-colors font-cyber text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>К каталогу</span>
            </button>
            
            {canEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/courses/${slug}/edit`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Course Header */}
              <Card variant="glass">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Level and Price */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-cyber uppercase tracking-wider ${getLevelColor(course.level)}`}>
                        {getLevelLabel(course.level)}
                      </span>
                      <div className={`px-3 py-1 text-sm font-cyber font-bold uppercase rounded ${
                        (course.price || 0) === 0 
                          ? 'bg-neon-green text-cyber-dark'
                          : 'bg-cyber-gray text-neon-cyan'
                      }`}>
                        {(course.price || 0) === 0 ? 'Бесплатно' : `${course.price} ₽`}
                      </div>
                    </div>

                    {/* Title */}
                    <h1 className="font-cyber text-3xl font-bold neon-text animate-pulse-neon">
                      {course.title}
                    </h1>

                    {/* Short Description */}
                    {course.shortDescription && (
                      <p className="text-gray-300 font-mono text-lg leading-relaxed">
                        {course.shortDescription}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-400 font-mono">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration || 0} часов</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Преподаватель: {course.instructor_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Создан: {new Date(course.createdAt).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button variant="primary" size="lg" className="w-full">
                      <Play className="w-5 h-5 mr-2" />
                      Начать изучение
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Course Description */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>
                    <span className="neon-text-green">ОПИСАНИЕ КУРСА</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 font-mono leading-relaxed whitespace-pre-wrap">
                      {course.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Course Image */}
              <Card variant="glass">
                <div className="aspect-video bg-cyber-dark flex items-center justify-center">
                  {course.image ? (
                    <img 
                      src={course.image} 
                      alt={course.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <BookOpen className="w-24 h-24 text-neon-cyan opacity-50" />
                  )}
                </div>
              </Card>

              {/* Instructor Info */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>
                    <span className="neon-text-cyan">ПРЕПОДАВАТЕЛЬ</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-cyber-gray border-2 border-neon-cyan rounded-full flex items-center justify-center">
                        {course.instructor_image ? (
                          <img 
                            src={course.instructor_image} 
                            alt={course.instructor_name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        ) : (
                          <User className="w-6 h-6 text-neon-cyan" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-cyber text-white font-bold">
                          {course.instructor_name}
                        </h4>
                        <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">
                          Преподаватель
                        </p>
                      </div>
                    </div>
                    
                    {course.instructor_bio && (
                      <p className="text-gray-400 text-sm font-mono leading-relaxed">
                        {course.instructor_bio}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Course Stats */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>
                    <span className="neon-text">СТАТИСТИКА</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-sm">Студентов:</span>
                      <span className="font-cyber text-neon-cyan">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-sm">Рейтинг:</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-neon-pink" />
                        <span className="font-cyber text-neon-pink">5.0</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 font-mono text-sm">Уроков:</span>
                      <span className="font-cyber text-neon-green">0</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}