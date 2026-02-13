'use client'

import React from 'react'
import { useSession, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FileUpload } from '@/components/ui/FileUpload'
import { 
  User, 
  Save,
  AlertCircle,
  CheckCircle,
  Settings as SettingsIcon,
  ArrowLeft
} from 'lucide-react'

const profileSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа').max(50, 'Имя не может быть длиннее 50 символов'),
  bio: z.string().max(500, 'Описание не может быть длиннее 500 символов').optional(),
  image: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function SettingsPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')
  const [profileData, setProfileData] = React.useState<any>(null)
  const [profileImage, setProfileImage] = React.useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  // Redirect if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  // Load user profile data
  React.useEffect(() => {
    const loadProfile = async () => {
      if (status === 'authenticated' && session?.user) {
        try {
          const response = await fetch('/api/profile')
          if (response.ok) {
            const data = await response.json()
            setProfileData(data.user)
            setProfileImage(data.user.image || '')
            reset({
              name: data.user.name || '',
              bio: data.user.bio || '',
              image: data.user.image || ''
            })
          }
        } catch (error) {
          console.error('Error loading profile:', error)
        }
      }
    }

    loadProfile()
  }, [status, session, reset])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cyber-dark grid-bg flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const profileData = {
        ...data,
        image: profileImage
      }

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess('Профиль успешно обновлён!')
        setProfileData(result.user)
        
        // Update session with new data
        await update({
          ...session,
          user: {
            ...session?.user,
            name: result.user.name
          }
        })

        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(result.error || 'Произошла ошибка при обновлении профиля')
      }
    } catch (error) {
      setError('Произошла ошибка при обновлении профиля')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cyber-dark grid-bg py-12">
      <div className="matrix-rain" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-cyber text-4xl font-bold neon-text mb-4 animate-pulse-neon">
                НАСТРОЙКИ
              </h1>
              <p className="text-gray-400 font-mono">
                Управление вашим профилем и настройками аккаунта
              </p>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-400 hover:text-neon-cyan transition-colors font-cyber text-sm uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Назад</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card variant="glass">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-cyber text-lg font-bold text-neon-cyan uppercase tracking-wider">
                      Разделы
                    </h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3 p-3 bg-cyber-light-gray rounded-lg border border-neon-cyan">
                        <User className="w-4 h-4 text-neon-cyan" />
                        <span className="font-cyber text-sm text-neon-cyan uppercase tracking-wider">
                          Профиль
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-cyber-light-gray transition-colors cursor-pointer">
                        <SettingsIcon className="w-4 h-4 text-gray-400" />
                        <span className="font-cyber text-sm text-gray-400 uppercase tracking-wider">
                          Приватность
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* User Info Card */}
              <Card variant="glass" className="mt-6">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-cyber-gray border-2 border-neon-cyan rounded-full flex items-center justify-center mx-auto animate-glow overflow-hidden">
                      {profileData?.image || profileImage ? (
                        <img 
                          src={profileData?.image || profileImage} 
                          alt={profileData?.name || ''} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-neon-cyan" />
                      )}
                    </div>
                    
                    <div>
                      <h4 className="font-cyber text-lg font-bold text-white mb-1">
                        {profileData?.name || session?.user?.name}
                      </h4>
                      <p className="text-gray-400 font-mono text-sm mb-2">
                        {profileData?.email || session?.user?.email}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs font-cyber uppercase rounded ${
                        profileData?.role === 'ADMIN' ? 'bg-neon-pink/20 text-neon-pink' :
                        profileData?.role === 'INSTRUCTOR' ? 'bg-neon-green/20 text-neon-green' :
                        'bg-neon-cyan/20 text-neon-cyan'
                      }`}>
                        {profileData?.role === 'ADMIN' ? 'Администратор' :
                         profileData?.role === 'INSTRUCTOR' ? 'Преподаватель' : 'Студент'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Form */}
            <div className="lg:col-span-2">
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>
                    <span className="glitch" data-text="РЕДАКТИРОВАНИЕ ПРОФИЛЯ">
                      РЕДАКТИРОВАНИЕ ПРОФИЛЯ
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
                      <label className="block text-sm font-medium text-neon-cyan font-cyber tracking-wider uppercase mb-2">
                        Фото профиля
                      </label>
                      <FileUpload
                        type="profile"
                        currentFile={profileImage}
                        onFileUploaded={setProfileImage}
                      />
                    </div>

                    <div>
                      <Input
                        {...register('name')}
                        label="Имя"
                        placeholder="Введите ваше имя"
                        error={errors.name?.message}
                        icon={<User className="w-4 h-4" />}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neon-cyan font-cyber tracking-wider uppercase mb-2">
                        О себе
                      </label>
                      <textarea
                        {...register('bio')}
                        rows={4}
                        className="cyber-input w-full resize-none"
                        placeholder="Расскажите немного о себе..."
                      />
                      {errors.bio && (
                        <p className="text-sm text-red-400 font-mono animate-pulse-neon mt-1">
                          {errors.bio.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 font-mono mt-1">
                        Максимум 500 символов
                      </p>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        loading={isLoading}
                        className="flex-1"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                      </Button>
                      
                      <Button 
                        type="button" 
                        variant="ghost"
                        onClick={() => reset()}
                      >
                        Сброс
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}