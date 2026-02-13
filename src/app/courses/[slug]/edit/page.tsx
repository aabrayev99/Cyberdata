'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { 
  BookOpen, 
  Save, 
  Eye, 
  Upload,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  Edit
} from 'lucide-react'

const editCourseSchema = z.object({
  title: z.string().min(5, 'Название должно содержать минимум 5 символов'),
  shortDescription: z.string().min(10, 'Краткое описание должно содержать минимум 10 символов'),
  description: z.string().min(50, 'Описание должно содержать минимум 50 символов'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  price: z.number().min(0, 'Цена не может быть отрицательной').optional(),
  duration: z.number().min(1, 'Длительность должна быть больше 0').optional(),
  image: z.string().optional(),
})

type EditCourseFormData = z.infer<typeof editCourseSchema>

export default function EditCoursePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const slug = params?.slug as string
  
  const [isLoading, setIsLoading] = React.useState(false)
  const [isLoadingCourse, setIsLoadingCourse] = React.useState(true)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [courseImage, setCourseImage] = React.useState('')
  const [course, setCourse] = React.useState<any>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<EditCourseFormData>({
    resolver: zodResolver(editCourseSchema),
  })

  // Load course data
  React.useEffect(() => {
    const loadCourse = async () => {
      if (!slug) return
      
      try {
        setIsLoadingCourse(true)
        const response = await fetch(`/api/courses/${slug}`)
        
        if (response.ok) {
          const data = await response.json()
          setCourse(data.course)
          setCourseImage(data.course.image || '')
          
          // Reset form with course data
          reset({
            title: data.course.title,
            shortDescription: data.course.shortDescription || '',
            description: data.course.description,
            level: data.course.level,
            price: data.course.price || 0,
            duration: data.course.duration || 1,
            image: data.course.image || ''
          })
        } else {
          setError('Курс не найден')
          router.push('/courses')
        }
      } catch (error) {
        setError('Ошибка загрузки курса')
      } finally {
        setIsLoadingCourse(false)
      }
    }

    loadCourse()
  }, [slug, reset, router])

  // Check permissions
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (
      status === 'authenticated' && 
      course && 
      session?.user?.role !== 'ADMIN' && 
      session?.user?.id !== course.instructorId
    ) {
      router.push('/unauthorized')
    }
  }, [status, session, course, router])

  if (status === 'loading' || isLoadingCourse) {
    return (
      <div className="min-h-screen bg-cyber-dark grid-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (status === 'unauthenticated' || !course) {
    return null
  }

  const onSubmit = async (data: EditCourseFormData) => {
    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const courseData = {
        ...data,
        image: courseImage
      }

      const response = await fetch(`/api/courses/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Курс успешно обновлён!')
        setCourse(result.course)
        setTimeout(() => {
          router.push(`/courses/${result.course.slug}`)
        }, 2000)
      } else {
        setError(result.error || 'Произошла ошибка при обновлении курса')
      }
    } catch (error) {
      setError('Произошла ошибка при обновлении курса')
    } finally {
      setIsLoading(false)
    }
  }

  const watchedValues = watch()

  return (
    <div className="min-h-screen bg-cyber-dark grid-bg py-12">
      <div className="matrix-rain" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-cyber text-4xl font-bold neon-text mb-4 animate-pulse-neon">
                РЕДАКТИРОВАНИЕ КУРСА
              </h1>
              <p className="text-gray-400 font-mono">
                Обновите информацию о курсе "{course?.title}"
              </p>
            </div>
            <button
              onClick={() => router.push(`/courses/${slug}`)}
              className="flex items-center space-x-2 text-gray-400 hover:text-neon-cyan transition-colors font-cyber text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>К курсу</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <span className="glitch" data-text="ИНФОРМАЦИЯ О КУРСЕ">
                    ИНФОРМАЦИЯ О КУРСЕ
                  </span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {error && (
                    <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-md text-sm font-mono animate-pulse-neon flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="bg-green-900/20 border border-green-500 text-green-400 p-3 rounded-md text-sm font-mono animate-pulse-neon flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{success}</span>
                    </div>
                  )}

                  <div>
                    <Input
                      {...register('title')}
                      label="Название курса"
                      placeholder="Введите название курса"
                      error={errors.title?.message}
                      icon={<BookOpen className="w-4 h-4" />}
                    />
                  </div>

                  <div>
                    <Input
                      {...register('shortDescription')}
                      label="Краткое описание"
                      placeholder="Краткое описание курса для карточки"
                      error={errors.shortDescription?.message}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-cyan font-cyber tracking-wider uppercase mb-2">
                      Полное описание
                    </label>
                    <textarea
                      {...register('description')}
                      rows={6}
                      className="cyber-input w-full resize-none"
                      placeholder="Подробное описание курса, что изучат студенты..."
                    />
                    {errors.description && (
                      <p className="text-sm text-red-400 font-mono animate-pulse-neon mt-1">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neon-cyan font-cyber tracking-wider uppercase mb-2">
                        Уровень сложности
                      </label>
                      <select
                        {...register('level')}
                        className="cyber-input w-full"
                      >
                        <option value="BEGINNER">Начальный</option>
                        <option value="INTERMEDIATE">Средний</option>
                        <option value="ADVANCED">Продвинутый</option>
                      </select>
                      {errors.level && (
                        <p className="text-sm text-red-400 font-mono animate-pulse-neon mt-1">
                          {errors.level.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Input
                        {...register('price', { valueAsNumber: true })}
                        type="number"
                        label="Цена (₽)"
                        placeholder="0"
                        error={errors.price?.message}
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>

                  <div>
                    <Input
                      {...register('duration', { valueAsNumber: true })}
                      type="number"
                      label="Длительность (часы)"
                      placeholder="20"
                      error={errors.duration?.message}
                      min="1"
                      step="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neon-cyan font-cyber tracking-wider uppercase mb-2">
                      Изображение курса
                    </label>
                    <FileUpload
                      type="course"
                      currentFile={courseImage}
                      onFileUploaded={setCourseImage}
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button 
                      type="submit" 
                      variant="primary" 
                      loading={isLoading}
                      className="flex-1"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? 'Обновление...' : 'Сохранить изменения'}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="ghost"
                      onClick={() => router.push(`/courses/${slug}`)}
                    >
                      Отмена
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle>
                  <span className="neon-text-green">ПРЕДПРОСМОТР</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {/* Course Preview Card */}
                  <div className="border border-cyber-light-gray rounded-lg overflow-hidden bg-cyber-gray/30">
                    <div className="aspect-video bg-cyber-dark border-b border-cyber-light-gray flex items-center justify-center">
                      {courseImage ? (
                        <img 
                          src={courseImage} 
                          alt="Course preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-12 h-12 text-neon-cyan opacity-50" />
                      )}
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-cyber uppercase tracking-wider ${
                          watchedValues.level === 'BEGINNER' ? 'text-neon-green' :
                          watchedValues.level === 'INTERMEDIATE' ? 'text-neon-cyan' : 'text-neon-pink'
                        }`}>
                          {watchedValues.level === 'BEGINNER' ? 'Начальный' :
                           watchedValues.level === 'INTERMEDIATE' ? 'Средний' : 'Продвинутый'}
                        </span>
                        <div className={`px-2 py-1 text-xs font-cyber font-bold uppercase rounded ${
                          (watchedValues.price || 0) === 0 
                            ? 'bg-neon-green text-cyber-dark'
                            : 'bg-cyber-gray text-neon-cyan'
                        }`}>
                          {(watchedValues.price || 0) === 0 ? 'Бесплатно' : `${watchedValues.price} ₽`}
                        </div>
                      </div>
                      
                      <h3 className="font-cyber text-lg font-bold text-white">
                        {watchedValues.title || course?.title}
                      </h3>
                      
                      <p className="text-gray-400 text-sm font-mono leading-relaxed">
                        {watchedValues.shortDescription || course?.shortDescription}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                        <span>{watchedValues.duration || course?.duration}ч</span>
                        <span>Преподаватель: {course?.instructor_name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description Preview */}
                  <div className="p-4 border border-cyber-light-gray rounded-lg bg-cyber-gray/20">
                    <h4 className="font-cyber text-sm font-bold text-neon-cyan mb-2 uppercase tracking-wider">
                      Описание курса
                    </h4>
                    <div className="text-gray-300 font-mono text-sm leading-relaxed">
                      {watchedValues.description || course?.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}