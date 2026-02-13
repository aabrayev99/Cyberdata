'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { 
  Search, 
  Filter, 
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronDown,
  Play,
  Lock,
  Edit,
  User
} from 'lucide-react'

export default function CoursesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedLevel, setSelectedLevel] = React.useState('ALL')
  const [selectedTag, setSelectedTag] = React.useState('ALL')
  const [showFilters, setShowFilters] = React.useState(false)
  const [courses, setCourses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  
  const levels = [
    { value: 'ALL', label: 'Все уровни' },
    { value: 'BEGINNER', label: 'Начальный' },
    { value: 'INTERMEDIATE', label: 'Средний' },
    { value: 'ADVANCED', label: 'Продвинутый' }
  ]
  
  const allTags = ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Visualization', 'Databases']
  
  // Load courses from API
  React.useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/courses')
        if (response.ok) {
          const data = await response.json()
          setCourses(data.courses || [])
        }
      } catch (error) {
        console.error('Error loading courses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])
  
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'ALL' || course.level === selectedLevel
    // For now, skip tag filtering since we don't have tags in database
    
    return matchesSearch && matchesLevel
  })
  
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
  
  return (
    <div className="min-h-screen bg-cyber-dark grid-bg py-12">
      <div className="matrix-rain" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="font-cyber text-5xl font-bold neon-text mb-4 animate-pulse-neon">
              КАТАЛОГ КУРСОВ
            </h1>
            <p className="text-gray-400 font-mono text-lg">
              Откройте для себя мир аналитики данных и машинного обучения
            </p>
          </div>
          
          {/* Search and Filters */}
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Input
                    placeholder="Поиск курсов..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-4 h-4" />}
                    className="w-full"
                  />
                </div>
                
                {/* Filter Toggle */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400 font-mono">
                    Найдено курсов: <span className="text-neon-cyan">{filteredCourses.length}</span>
                  </div>
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 text-neon-cyan hover:text-neon-pink transition-colors font-cyber text-sm uppercase tracking-wider"
                  >
                    <Filter className="w-4 h-4" />
                    <span>Фильтры</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                
                {/* Filters */}
                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-cyber-light-gray rounded-lg bg-cyber-gray/30">
                    <div>
                      <label className="block text-sm font-medium text-neon-cyan font-cyber mb-2 uppercase tracking-wider">
                        Уровень сложности
                      </label>
                      <select
                        value={selectedLevel}
                        onChange={(e) => setSelectedLevel(e.target.value)}
                        className="cyber-input w-full"
                      >
                        {levels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Loading */}
          {loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400 font-mono">Загрузка курсов...</p>
            </div>
          )}
          
          {/* No courses */}
          {!loading && courses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-24 h-24 text-gray-400 mx-auto mb-4" />
              <h3 className="font-cyber text-xl text-gray-400 mb-2">Курсы не найдены</h3>
              <p className="text-gray-500 font-mono mb-6">
                Пока что курсы не созданы. Создайте первый курс!
              </p>
              {(session?.user?.role === 'ADMIN' || session?.user?.role === 'INSTRUCTOR') && (
                <Button 
                  variant="primary"
                  onClick={() => router.push('/courses/create')}
                >
                  Создать курс
                </Button>
              )}
            </div>
          )}
          
          {/* Course Grid */}
          {!loading && filteredCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card key={course.id} variant="glass" className="group hover:border-neon-cyan transition-all duration-300 cursor-pointer">
                  <div className="relative overflow-hidden">
                    {/* Course Image */}
                    <div className="aspect-video bg-cyber-gray border-b border-cyber-light-gray flex items-center justify-center relative">
                      {course.image ? (
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-16 h-16 text-neon-cyan opacity-50" />
                      )}
                      
                      {/* Edit button for instructors/admins */}
                      {session?.user && (
                        session.user.role === 'ADMIN' || 
                        session.user.id === course.instructorId
                      ) && (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            router.push(`/courses/${course.slug}/edit`)
                          }}
                          className="absolute top-2 right-2 p-2 bg-cyber-gray/80 backdrop-blur-sm text-neon-cyan hover:text-white hover:bg-neon-cyan/20 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                          title="Редактировать курс"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    {/* Course Content */}
                    <CardContent className="p-6 space-y-4">
                      {/* Level and Price */}
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-cyber uppercase tracking-wider ${getLevelColor(course.level)}`}>
                          {getLevelLabel(course.level)}
                        </span>
                        <div className={`px-2 py-1 text-xs font-cyber font-bold uppercase rounded ${
                          (course.price || 0) === 0 
                            ? 'bg-neon-green text-cyber-dark'
                            : 'bg-cyber-gray text-neon-cyan'
                        }`}>
                          {(course.price || 0) === 0 ? 'Бесплатно' : `${course.price} ₽`}
                        </div>
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-cyber text-lg font-bold text-white group-hover:text-neon-cyan transition-colors">
                        {course.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-400 text-sm font-mono leading-relaxed line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                      
                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{course.duration || 0}ч</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-3 h-3" />
                            <span>{course.instructor_name}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="w-full"
                        onClick={() => router.push(`/courses/${course.slug}`)}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Изучать
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}