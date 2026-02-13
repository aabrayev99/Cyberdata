'use client'

import React from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react'

const signUpSchema = z.object({
  name: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
})

type SignUpFormData = z.infer<typeof signUpSchema>

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema)
  })
  
  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true)
      setError('')
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })
      
      if (response.ok) {
        setSuccess(true)
        setTimeout(async () => {
          // Auto sign in after successful registration
          const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false
          })
          
          if (result?.ok) {
            router.push('/profile')
          }
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Произошла ошибка при регистрации')
      }
    } catch (error) {
      setError('Произошла ошибка при регистрации')
    } finally {
      setIsLoading(false)
    }
  }
  
  if (success) {
    return (
      <div className="min-h-screen bg-cyber-dark grid-bg flex items-center justify-center px-4 py-12">
        <div className="matrix-rain" />
        <div className="max-w-md w-full">
          <Card variant="neon" className="text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-neon-green mx-auto mb-4 animate-pulse" />
              <h2 className="font-cyber text-2xl font-bold text-neon-green mb-2 animate-pulse-neon">
                РЕГИСТРАЦИЯ УСПЕШНА!
              </h2>
              <p className="text-gray-300 font-mono mb-4">
                Добро пожаловать в систему обучения аналитике данных.
              </p>
              <p className="text-sm text-gray-400 font-mono">
                Автоматический вход в систему...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-cyber-dark grid-bg flex items-center justify-center px-4 py-12">
      {/* Matrix rain effect */}
      <div className="matrix-rain" />
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-cyber text-4xl font-bold neon-text-pink mb-2 animate-pulse-neon">
            РЕГИСТРАЦИЯ
          </h1>
          <p className="text-gray-400 font-mono">
            Создайте аккаунт для доступа к курсам аналитики данных
          </p>
        </div>
        
        <Card variant="glass" className="backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-neon-pink">
              <span className="glitch" data-text="НОВЫЙ ПОЛЬЗОВАТЕЛЬ">
                НОВЫЙ ПОЛЬЗОВАТЕЛЬ
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-md text-sm font-mono animate-pulse-neon">
                  {error}
                </div>
              )}
              
              <div>
                <Input
                  {...register('name')}
                  type="text"
                  label="Имя"
                  placeholder="Ваше имя"
                  error={errors.name?.message}
                  icon={<User className="w-4 h-4" />}
                />
              </div>
              
              <div>
                <Input
                  {...register('email')}
                  type="email"
                  label="Email"
                  placeholder="your.email@domain.com"
                  error={errors.email?.message}
                  icon={<Mail className="w-4 h-4" />}
                />
              </div>
              
              <div>
                <div className="relative">
                  <Input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    label="Пароль"
                    placeholder="••••••••"
                    error={errors.password?.message}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-11 text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <div className="relative">
                  <Input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    label="Подтвердите пароль"
                    placeholder="••••••••"
                    error={errors.confirmPassword?.message}
                    icon={<Lock className="w-4 h-4" />}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-11 text-gray-400 hover:text-neon-cyan transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                loading={isLoading}
                className="w-full mt-6"
              >
                {isLoading ? 'СОЗДАНИЕ АККАУНТА...' : 'ЗАРЕГИСТРИРОВАТЬСЯ'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 font-mono text-sm">
                Уже есть аккаунт?{' '}
                <Link 
                  href="/auth/signin"
                  className="text-neon-pink hover:text-neon-cyan transition-colors font-cyber tracking-wider"
                >
                  ВОЙТИ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Decorative elements */}
        <div className="flex justify-center space-x-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-8 bg-neon-pink animate-pulse`}
              style={{
                animationDelay: `${i * 0.2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}