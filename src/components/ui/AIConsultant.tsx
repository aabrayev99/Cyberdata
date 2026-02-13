'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './Card'
import { Button } from './Button'
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User,
  Sparkles,
  BookOpen,
  TrendingUp,
  Award,
  Users,
  Zap
} from 'lucide-react'

interface Message {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
}

const predefinedQuestions = [
  "Как начать изучать аналитику данных?",
  "Какой курс выбрать новичку?", 
  "Сколько зарабатывают аналитики данных?",
  "Какие навыки я получу?",
  "Есть ли бесплатные курсы?",
  "Сколько стоят курсы?",
  "Какие карьерные перспективы?",
  "Дают ли вы сертификаты?",
  "Есть ли поддержка студентов?"
]

const botResponses: Record<string, string> = {
  "как начать": "🚀 Отличный выбор! Для начала рекомендую курс 'Python для анализа данных'. Он покрывает основы программирования и работы с данными. Зарегистрируйтесь сейчас и получите доступ к первым урокам бесплатно!",
  "какой курс": "🎯 Для новичков идеально подходит наш базовый курс по Python и анализу данных. Он включает практические задания, реальные проекты и поддержку наставников. Хотите начать прямо сейчас?",
  "время": "⏰ В среднем наши студенты осваивают базовый уровень за 2-3 месяца, занимаясь 2-3 часа в неделю. Но вы можете учиться в своем темпе! Регистрируйтесь и составим индивидуальный план обучения.",
  "навыки": "💪 После наших курсов вы будете уметь: анализировать данные с Python/SQL, создавать визуализации, строить ML модели, работать с большими данными. Это востребованные навыки с зарплатой от 100k ₽!",
  "бесплатные": "🎁 Да! У нас есть бесплатные курсы и пробные уроки. После регистрации вы получите доступ к базовым материалам и сможете оценить качество обучения перед покупкой.",
  "цена": "💰 Наши цены очень конкурентные! Базовые курсы от 1990₽, а многие материалы вообще бесплатны. Инвестиция в образование окупается уже через 2-3 месяца работы аналитиком! Плюс рассрочка и скидки.",
  "зарплата": "💸 Аналитики данных зарабатывают от 80k₽ (junior) до 300k₽+ (senior). Средняя зарплата 150k₽. Уже после первого курса можете претендовать на позицию стажера с зарплатой 60-80k₽!",
  "карьера": "📈 Карьерные перспективы огромные! Data Analyst → Senior Analyst → Lead Analyst → Head of Analytics. Или специализация: ML Engineer, Data Scientist, Business Analyst. Рынок растет на 25% в год!",
  "сертификат": "🏆 Да! По окончании курса вы получите сертификат, который признают ведущие IT-компании. Плюс портфолио реальных проектов для собеседований. 87% наших выпускников находят работу в течение 3 месяцев!",
  "поддержка": "👨‍💻 У нас лучшая поддержка! Персональные кураторы, чат с наставниками 24/7, code review, помощь в трудоустройстве, активное комьюнити. Вы никогда не останетесь один на один с проблемой!",
  "default": "🤖 Отличный вопрос! Наша платформа помогает освоить аналитику данных с нуля до профессионального уровня. Зарегистрируйтесь сейчас и получите персональный план обучения + доступ к пробным урокам!"
}

export const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Message[]>([])
  const [inputValue, setInputValue] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  React.useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Приветственное сообщение
      setTimeout(() => {
        addBotMessage("👋 Привет! Я AI-консультант платформы Data Analytics. Помогу выбрать курс и ответить на вопросы об обучении. О чем хотите узнать?")
      }, 500)
    }
  }, [isOpen])

  const addBotMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'bot',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const addUserMessage = (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, newMessage])
  }

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    for (const [key, response] of Object.entries(botResponses)) {
      if (key !== 'default' && message.includes(key)) {
        return response
      }
    }
    
    return botResponses.default
  }

  const handleSendMessage = async (message?: string) => {
    const messageToSend = message || inputValue.trim()
    if (!messageToSend) return

    setInputValue('')
    addUserMessage(messageToSend)
    setIsTyping(true)

    // Симуляция печати
    setTimeout(() => {
      setIsTyping(false)
      const response = getBotResponse(messageToSend)
      addBotMessage(response)
    }, 1000 + Math.random() * 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-neon-gradient rounded-full shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 flex items-center justify-center group z-50"
          style={{ animation: 'float 3s ease-in-out infinite, chat-glow 2s ease-in-out infinite' }}
        >
          <MessageCircle className="w-6 h-6 text-cyber-dark group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-neon-pink rounded-full flex items-center justify-center animate-bounce">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50">
          <Card variant="glass" className="h-full flex flex-col border-neon-cyan animate-glow">
            {/* Header */}
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-neon-gradient rounded-full flex items-center justify-center animate-pulse">
                    <Bot className="w-5 h-5 text-cyber-dark" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">AI Консультант</CardTitle>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-neon-green rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-400 font-mono">онлайн</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-neon-cyan transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="h-full overflow-y-auto px-6 pb-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-neon-cyan' 
                          : 'bg-neon-gradient animate-pulse'
                      }`}>
                        {message.type === 'user' ? (
                          <User className="w-3 h-3 text-cyber-dark" />
                        ) : (
                          <Bot className="w-3 h-3 text-cyber-dark" />
                        )}
                      </div>
                      <div className={`px-3 py-2 rounded-lg text-sm font-mono ${
                        message.type === 'user'
                          ? 'bg-neon-cyan text-cyber-dark'
                          : 'bg-cyber-light-gray text-gray-300 border border-neon-green/30'
                      }`}>
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-neon-gradient rounded-full flex items-center justify-center animate-pulse">
                        <Bot className="w-3 h-3 text-cyber-dark" />
                      </div>
                      <div className="bg-cyber-light-gray px-3 py-2 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-neon-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            {/* Quick Questions */}
            {messages.length <= 1 && !isTyping && (
              <div className="px-6 pb-4">
                <p className="text-xs text-gray-400 font-mono mb-2 uppercase tracking-wider">Популярные вопросы:</p>
                <div className="space-y-1">
                  {predefinedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSendMessage(question)}
                      className="w-full text-left text-xs p-2 bg-cyber-gray hover:bg-cyber-light-gray text-gray-400 hover:text-neon-cyan rounded transition-colors font-mono"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-6 pt-0 border-t border-cyber-light-gray">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Задайте вопрос..."
                  className="flex-1 cyber-input text-sm"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-8 h-8 bg-neon-gradient rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-neon-cyan/30 transition-all duration-200 disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-cyber-dark" />
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  )
}

export default AIConsultant