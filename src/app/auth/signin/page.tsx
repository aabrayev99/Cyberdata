'use client'

import React from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'

const signInSchema = z.object({
  email: z.string().email('Неверный формат email'),
  password: z.string().min(6, 'Пароль должен содержать минимум 6 символов'),
})

type SignInFormData = z.infer<typeof signInSchema>

export default function SignInPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema)
  })
  
  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsLoading(true)
      setError('')
      
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })
      
      if (result?.error) {
        setError('Неверный email или пароль')
      } else {
        // Get the session to redirect based on role
        const session = await getSession()
        if (session?.user) {
          router.push('/profile')
        }
      }
    } catch (error) {
      setError('Произошла ошибка при входе в систему')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen bg-cyber-dark grid-bg flex items-center justify-center px-4 py-12">
      {/* Matrix rain effect */}
      <div className="matrix-rain" />
      
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="font-cyber text-4xl font-bold neon-text mb-2 animate-pulse-neon">
            ВХОД В СИСТЕМУ
          </h1>
          <p className="text-gray-400 font-mono">
            Войдите в свой аккаунт для доступа к курсам
          </p>
        </div>
        
        <Card variant="glass" className="backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center">
              <span className="glitch" data-text="АВТОРИЗАЦИЯ">
                АВТОРИЗАЦИЯ
              </span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 p-3 rounded-md text-sm font-mono animate-pulse-neon">
                  {error}
                </div>
              )}
              
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
              
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isLoading}
                className="w-full"
              >
                {isLoading ? 'ПОДКЛЮЧЕНИЕ...' : 'ВОЙТИ'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-400 font-mono text-sm">
                Нет аккаунта?{' '}
                <Link 
                  href="/auth/signup"
                  className="text-neon-cyan hover:text-neon-pink transition-colors font-cyber tracking-wider"
                >
                  ЗАРЕГИСТРИРОВАТЬСЯ
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Decorative elements */}
        <div className="flex justify-center space-x-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full animate-pulse`}
              style={{
                backgroundColor: i === 0 ? '#00ffff' : i === 1 ? '#ff0080' : '#00ff80',
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}