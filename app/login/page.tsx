'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

interface User {
  username: string
  password: string
  level: string
  isAdmin?: boolean
  createdAt: string
}

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState('beginner')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  // Check if already logged in
  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      router.push('/quiz')
    }
  }, [router])

  // Initialize admin user if no users exist
  useEffect(() => {
    const users = localStorage.getItem('users')
    if (!users) {
      const adminUser: User = {
        username: 'admin',
        password: 'admin123',
        level: 'advanced',
        isAdmin: true,
        createdAt: new Date().toISOString()
      }
      localStorage.setItem('users', JSON.stringify([adminUser]))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!username.trim() || !password.trim()) {
      setError('Введите имя пользователя и пароль')
      return
    }

    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')

    if (isLogin) {
      // Login logic
      const user = users.find(u => u.username === username.trim() && u.password === password)
      if (!user) {
        setError('Неверное имя пользователя или пароль')
        return
      }
      
      localStorage.setItem('currentUser', JSON.stringify(user))
      router.push(user.isAdmin ? '/admin' : '/map')
    } else {
      // Registration logic
      if (users.find(u => u.username === username.trim())) {
        setError('Пользователь с таким именем уже существует')
        return
      }

      if (password.length < 4) {
        setError('Пароль должен быть минимум 4 символа')
        return
      }

      const newUser: User = {
        username: username.trim(),
        password,
        level,
        isAdmin: false,
        createdAt: new Date().toISOString()
      }

      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      setSuccess('Регистрация успешна! Переход...')
      setTimeout(() => router.push('/map'), 1000)
    }
  }

  return (
    <main className="container">
      <div className="card text-center" style={{ maxWidth: '450px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <Image 
            src="/logo.png" 
            alt="MemeLand Logo" 
            width={180} 
            height={120}
            style={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 0 20px rgba(139, 92, 246, 0.5))' }}
            priority
          />
        </div>
        <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>
          {isLogin ? 'Добро пожаловать' : 'Создать аккаунт'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
          {isLogin ? 'Войдите, чтобы продолжить обучение' : 'Начните изучать язык через мемы'}
        </p>

        {error && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.2)', 
            border: '1px solid rgba(244, 63, 94, 0.4)',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#f43f5e'
          }}>
            <svg style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
        {success && (
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.2)', 
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '0.75rem',
            padding: '0.75rem',
            marginBottom: '1rem',
            color: '#10b981'
          }}>
            <svg style={{ width: '16px', height: '16px', marginRight: '0.5rem', display: 'inline' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              type="text"
              placeholder="Введите имя..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="level">Уровень сложности</label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="beginner">Начальный - Базовый словарь</option>
                <option value="intermediate">Средний - Обычные выражения</option>
                <option value="advanced">Продвинутый - Сленг и сложные фразы</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isLogin ? (
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
              ) : (
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm14 7l-4-4m0 0l-4 4m4-4v12"></path>
              )}
            </svg>
            <span>{isLogin ? 'Войти' : 'Зарегистрироваться'}</span>
          </button>
        </form>

        <div style={{ marginTop: '1.5rem' }}>
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess('') }}
            className="btn btn-outline"
            style={{ fontSize: '0.875rem' }}
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
          </button>
        </div>

        <p style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
          Админ: admin / admin123
        </p>
      </div>
    </main>
  )
}
