'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  Search, 
  Filter, 
  BookOpen,
  Clock,
  Users,
  Star,
  ChevronDown,
  Play,
  Lock
} from 'lucide-react'

// Заглушка данных курсов
const sampleCourses = [
  {
    id: '1',
    title: 'Python для анализа данных',
    slug: 'python-data-analysis',
    shortDescription: 'Изучите основы анализа данных с использованием Python, pandas и numpy',
    description: 'Полный курс по анализу данных с Python...',
    image: '/api/placeholder/400/250',
    level: 'BEGINNER',
    price: 0,
    duration: 20,
    instructor_name: 'Анна Иванова',
    published: true,
    featured: true,
    tags: ['Python', 'Data Analysis'],
    enrollmentCount: 1250,
    rating: 4.8,
    lessons: 15
  },
  {
    id: '2',
    title: 'Машинное обучение с Scikit-learn',
    slug: 'machine-learning-scikit',
    shortDescription: 'Практический курс по машинному обучению для начинающих',
    description: 'Изучите алгоритмы машинного обучения...',
    image: '/api/placeholder/400/250',
    level: 'INTERMEDIATE',
    price: 2999,
    duration: 35,
    instructor_name: 'Дмитрий Петров',
    published: true,
    featured: false,
    tags: ['Machine Learning', 'Python'],
    enrollmentCount: 890,
    rating: 4.9,
    lessons: 28
  },
  {
    id: '3',
    title: 'SQL и базы данных',
    slug: 'sql-databases',
    shortDescription: 'Мастер-класс по работе с базами данных и SQL запросам',
    description: 'Углубленное изучение SQL...',
    image: '/api/placeholder/400/250',
    level: 'BEGINNER',
    price: 1999,
    duration: 15,
    instructor_name: 'Елена Сидорова',
    published: true,
    featured: true,
    tags: ['SQL', 'Databases'],
    enrollmentCount: 2100,
    rating: 4.7,
    lessons: 20
  }
]

export default function CoursesPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedLevel, setSelectedLevel] = React.useState('ALL')
  const [selectedTag, setSelectedTag] = React.useState('ALL')
  const [showFilters, setShowFilters] = React.useState(false)
  
  const levels = [
    { value: 'ALL', label: 'Все уровни' },
    { value: 'BEGINNER', label: 'Начальный' },
    { value: 'INTERMEDIATE', label: 'Средний' },
    { value: 'ADVANCED', label: 'Продвинутый' }
  ]
  
  const allTags = ['Python', 'SQL', 'Machine Learning', 'Data Analysis', 'Visualization', 'Databases']
  
  const filteredCourses = sampleCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'ALL' || course.level === selectedLevel
    const matchesTag = selectedTag === 'ALL' || course.tags.includes(selectedTag)
    
    return matchesSearch && matchesLevel && matchesTag
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
                    
                    <div>
                      <label className="block text-sm font-medium text-neon-cyan font-cyber mb-2 uppercase tracking-wider">
                        Тематика
                      </label>
                      <select
                        value={selectedTag}
                        onChange={(e) => setSelectedTag(e.target.value)}
                        className="cyber-input w-full"
                      >
                        <option value="ALL">Все темы</option>
                        {allTags.map(tag => (
                          <option key={tag} value={tag}>
                            {tag}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <Card key={course.id} variant="glass" className="group hover:border-neon-cyan transition-all duration-300">
                <div className="relative overflow-hidden">
                  {/* Course Image */}
                  <div className="aspect-video bg-cyber-gray border-b border-cyber-light-gray flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-neon-cyan opacity-50" />
                  </div>
                  
                  {/* Featured Badge */}
                  {course.featured && (
                    <div className="absolute top-3 left-3">
                      <div className="bg-neon-pink text-cyber-dark px-2 py-1 text-xs font-cyber font-bold uppercase rounded">
                        Популярный
                      </div>
                    </div>
                  )}
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3">
                    <div className={`px-2 py-1 text-xs font-cyber font-bold uppercase rounded ${
                      course.price === 0 
                        ? 'bg-neon-green text-cyber-dark'
                        : 'bg-cyber-gray/80 text-neon-cyan'
                    }`}>
                      {course.price === 0 ? 'Бесплатно' : `${course.price} ₽`}
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Course Info */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-cyber uppercase tracking-wider ${getLevelColor(course.level)}`}>
                          {getLevelLabel(course.level)}
                        </span>
                        <div className="flex items-center space-x-1 text-neon-yellow">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-mono">{course.rating}</span>
                        </div>
                      </div>
                      
                      <h3 className="font-cyber text-lg font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm font-mono leading-relaxed mb-3">
                        {course.shortDescription}
                      </p>
                      
                      <p className="text-gray-500 text-xs font-mono">
                        Преподаватель: <span className="text-neon-cyan">{course.instructor_name}</span>
                      </p>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.duration}ч</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{course.lessons} уроков</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{course.enrollmentCount}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-cyber-light-gray text-neon-cyan text-xs font-mono rounded-sm border border-neon-cyan/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    {/* Action Button */}
                    <div className="pt-2">
                      {session ? (
                        <Button variant="primary" className="w-full">
                          <Play className="w-4 h-4 mr-2" />
                          Начать курс
                        </Button>
                      ) : (
                        <Button variant="ghost" className="w-full">
                          <Lock className="w-4 h-4 mr-2" />
                          Войдите для доступа
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <Card variant="glass" className="text-center py-16">
              <CardContent>
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-cyber text-xl font-bold text-gray-400 mb-2">
                  Курсы не найдены
                </h3>
                <p className="text-gray-500 font-mono">
                  Попробуйте изменить параметры поиска или фильтры
                </p>
              </CardContent>
            </Card>
          )}
          
          {/* CTA for instructors */}
          {session?.user?.role === 'INSTRUCTOR' || session?.user?.role === 'ADMIN' ? (
            <Card variant="neon" className="text-center">
              <CardContent className="p-8">
                <h2 className="font-cyber text-2xl font-bold neon-text-pink mb-4">
                  СОЗДАЙТЕ СВОЙ КУРС
                </h2>
                <p className="text-gray-300 font-mono mb-6">
                  Поделитесь своими знаниями с сообществом аналитиков данных
                </p>
                <Button variant="secondary" size="lg">
                  Создать курс
                </Button>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  )
}