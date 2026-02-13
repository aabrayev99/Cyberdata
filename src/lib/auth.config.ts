import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { findUserByEmail } from './db-simple'
import { comparePassword } from './auth'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        const user = await findUserByEmail(credentials.email)

        if (!user || !user.password) {
          throw new Error('Invalid credentials')
        }

        const isValidPassword = await comparePassword(
          credentials.password,
          user.password
        )

        if (!isValidPassword) {
          throw new Error('Invalid credentials')
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // На первом входе сохраняем данные пользователя
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      
      // Обновляем данные пользователя при каждом обращении к сессии
      if (trigger === 'update' && session?.user) {
        token.role = session.user.role
        token.name = session.user.name
      }
      
      // Периодически обновляем роль из базы данных
      if (token.id && (!token.lastRefresh || Date.now() - (token.lastRefresh as number) > 5 * 60 * 1000)) {
        try {
          const { findUserById } = await import('./db-simple')
          const userData = await findUserById(token.id as string)
          if (userData) {
            token.role = userData.role
            token.name = userData.name
            token.lastRefresh = Date.now()
          }
        } catch (error) {
          console.error('Error refreshing user data:', error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.name = token.name as string
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  },
  secret: process.env.NEXTAUTH_SECRET
}