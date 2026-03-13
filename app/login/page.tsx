'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
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
      router.push(user.isAdmin ? '/admin' : '/quiz')
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
      setTimeout(() => router.push('/quiz'), 1000)
    }
  }

  return (
    <main className="container">
      <div className="card text-center">
        <div style={{ marginBottom: '1rem' }}>
          <Image 
            src="/logo.png" 
            alt="MemeLand Logo" 
            width={200} 
            height={130}
            style={{ maxWidth: '100%', height: 'auto' }}
            priority
          />
        </div>
        <h2 style={{ marginBottom: '1rem', color: '#7c3aed' }}>
          {isLogin ? '👋 Вход' : '✨ Регистрация'}
        </h2>
        <p style={{ marginBottom: '1.5rem' }}>
          {isLogin 
            ? 'Введите имя пользователя и пароль для входа.' 
            : 'Создайте аккаунт, чтобы начать обучение.'}
        </p>

        {error && <p className="error-msg">{error}</p>}
        {success && <p className="success-msg">{success}</p>}

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
                <option value="beginner">🌱 Начальный - Базовый словарь</option>
                <option value="intermediate">📚 Средний - Обычные выражения</option>
                <option value="advanced">🎯 Продвинутый - Сленг и сложные фразы</option>
              </select>
            </div>
          )}

          <button type="submit" className="btn" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? '🚀 Войти' : '✨ Зарегистрироваться'}
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

        <div style={{ marginTop: '1rem' }}>
          <Link href="/" className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>
            🏠 На главную
          </Link>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: '#9333ea' }}>
          Админ: admin / admin123
        </p>
      </div>
    </main>
  )
}
