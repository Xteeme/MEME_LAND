'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  username: string
  password: string
  level: string
  isAdmin?: boolean
  createdAt: string
}

interface Stats {
  correct: number
  incorrect: number
  hints: number
  score: number
}

interface Session {
  date: string
  stats: Stats
  level: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [totalStats, setTotalStats] = useState<Stats>({ correct: 0, incorrect: 0, hints: 0, score: 0 })
  const [sessions, setSessions] = useState<Session[]>([])
  const [errors, setErrors] = useState<any[]>([])
  const [repeat, setRepeat] = useState<any[]>([])

  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (!userData) {
      router.push('/login')
      return
    }
    const parsedUser = JSON.parse(userData)
    if (parsedUser.isAdmin) {
      router.push('/admin')
      return
    }
    setUser(parsedUser)

    const statsData = localStorage.getItem('totalStats')
    if (statsData) setTotalStats(JSON.parse(statsData))

    const sessionsData = localStorage.getItem('sessions')
    if (sessionsData) setSessions(JSON.parse(sessionsData))

    const errorsData = localStorage.getItem(`errors_${parsedUser.username}`)
    if (errorsData) setErrors(JSON.parse(errorsData))

    const repeatData = localStorage.getItem(`repeat_${parsedUser.username}`)
    if (repeatData) setRepeat(JSON.parse(repeatData))
  }, [router])

  const changeLevel = (newLevel: string) => {
    if (user) {
      const updatedUser = { ...user, level: newLevel }
      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      
      // Update in users list
      const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
      const updatedUsers = users.map(u => 
        u.username === user.username ? { ...u, level: newLevel } : u
      )
      localStorage.setItem('users', JSON.stringify(updatedUsers))
    }
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  if (!user) {
    return (
      <main className="container">
        <div className="card text-center">
          <p>Загрузка...</p>
        </div>
      </main>
    )
  }

  const totalQuestions = totalStats.correct + totalStats.incorrect
  const successRate = totalQuestions > 0 ? Math.round((totalStats.correct / totalQuestions) * 100) : 0

  return (
    <main className="container">
      <div className="card card-wide">
        <h1>👤 Профиль: {user.username}</h1>

        {/* Level Selection */}
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label>Текущий уровень</label>
          <select value={user.level} onChange={(e) => changeLevel(e.target.value)}>
            <option value="beginner">🌱 Начальный</option>
            <option value="intermediate">📚 Средний</option>
            <option value="advanced">🎯 Продвинутый</option>
          </select>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-1" style={{ marginTop: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/quiz" className="btn">🎯 Начать викторину</Link>
          <Link href="/constructor" className="btn btn-secondary">➕ Добавить мемы</Link>
          <button onClick={logout} className="btn btn-outline">🚪 Выйти</button>
        </div>

        {/* Total Stats */}
        <h2 style={{ marginTop: '2rem' }}>📊 Общая статистика</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{totalStats.correct}</div>
            <div className="stat-label">Правильно</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalStats.incorrect}</div>
            <div className="stat-label">Неправильно</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalStats.hints}</div>
            <div className="stat-label">Подсказок</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{successRate}%</div>
            <div className="stat-label">Успешность</div>
          </div>
        </div>

        {/* Errors List */}
        <h2 style={{ marginTop: '1.5rem' }}>❌ Ошибки ({errors.length})</h2>
        {errors.length > 0 ? (
          <ul className="list" style={{ maxHeight: '150px', overflow: 'auto' }}>
            {errors.slice(0, 5).map((error, i) => (
              <li key={i} className="list-item">
                {error.sentence} → <strong>{error.correctWord}</strong>
              </li>
            ))}
            {errors.length > 5 && <li className="list-item text-sm">...и ещё {errors.length - 5}</li>}
          </ul>
        ) : (
          <p className="text-sm" style={{ color: '#16a34a' }}>Нет ошибок! Отличная работа! 🎉</p>
        )}

        {/* Repeat List */}
        <h2 style={{ marginTop: '1.5rem' }}>🔄 Повторение ({repeat.length})</h2>
        {repeat.length > 0 ? (
          <ul className="list" style={{ maxHeight: '150px', overflow: 'auto' }}>
            {repeat.slice(0, 5).map((item, i) => (
              <li key={i} className="list-item">
                {item.sentence} → <strong>{item.correctWord}</strong>
              </li>
            ))}
            {repeat.length > 5 && <li className="list-item text-sm">...и ещё {repeat.length - 5}</li>}
          </ul>
        ) : (
          <p className="text-sm">Пока нечего повторять.</p>
        )}

        {/* Recent Sessions */}
        <h2 style={{ marginTop: '1.5rem' }}>📈 Недавние сессии</h2>
        {sessions.length > 0 ? (
          <ul className="list">
            {sessions.slice(-3).reverse().map((session, i) => (
              <li key={i} className="list-item">
                <div className="flex flex-between">
                  <span>{new Date(session.date).toLocaleDateString()}</span>
                  <span>Счёт: {session.stats.score.toFixed(1)}</span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm">Пока нет сессий. Начните викторину!</p>
        )}

        {/* Home Link */}
        <div className="text-center" style={{ marginTop: '2rem' }}>
          <Link href="/" className="btn btn-outline">🏠 На главную</Link>
        </div>
      </div>
    </main>
  )
}
