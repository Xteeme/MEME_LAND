'use client'

import { useEffect, useState } from 'react'
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
  const [streak, setStreak] = useState<boolean[]>([false, false, false, false, false, false, false])

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

    // Load user-specific stats
    const statsData = localStorage.getItem(`stats_${parsedUser.username}`)
    if (statsData) setTotalStats(JSON.parse(statsData))

    const sessionsData = localStorage.getItem(`sessions_${parsedUser.username}`)
    if (sessionsData) setSessions(JSON.parse(sessionsData))

    const errorsData = localStorage.getItem(`errors_${parsedUser.username}`)
    if (errorsData) setErrors(JSON.parse(errorsData))

    const repeatData = localStorage.getItem(`repeat_${parsedUser.username}`)
    if (repeatData) setRepeat(JSON.parse(repeatData))

    // Load streak data
    const streakKey = `streak_${parsedUser.username}`
    const savedStreak = localStorage.getItem(streakKey)
    if (savedStreak) {
      setStreak(JSON.parse(savedStreak))
    }
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
    <main className="container" style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '2rem' }}>
      {/* Left Side - Achievements Shelf */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 20, 60, 0.8) 0%, rgba(20, 15, 40, 0.9) 100%)',
        borderRadius: '1rem',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)',
        padding: '1.5rem',
        minWidth: '250px',
        minHeight: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
          </svg>
          <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Достижения</h2>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textAlign: 'center' }}>
          Здесь будут отображаться ваши достижения
        </p>
        {/* Achievement slots placeholder */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginTop: '1.5rem',
          width: '100%'
        }}>
          {[...Array(9)].map((_, i) => (
            <div key={i} style={{
              aspectRatio: '1',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '0.75rem',
              border: '1px dashed rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0.5
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side - Profile Card */}
      <div className="card card-wide" style={{ margin: '0', flex: '0 0 auto' }}>
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: '1rem' }}>
          <Image 
            src="/logo.png" 
            alt="MemeLand Logo" 
            width={100} 
            height={65}
            style={{ maxWidth: '100%', height: 'auto', filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))' }}
          />
        </div>

        {/* Header with back to map */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/map" className="glow-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"></polygon>
              </svg>
              <span>Карта</span>
            </Link>
            <button onClick={logout} className="glow-btn glow-btn-red" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Выйти</span>
            </button>
          </div>
        </div>

        <h2 style={{ textAlign: 'center' }}>{user.username}</h2>

        {/* Level Selection */}
        <div className="form-group" style={{ marginTop: '1rem' }}>
          <label>Текущий уровень сложности</label>
          <select value={user.level} onChange={(e) => changeLevel(e.target.value)}>
            <option value="beginner">Начальный</option>
            <option value="intermediate">Средний</option>
            <option value="advanced">Продвинутый</option>
          </select>
        </div>

        {/* Streak Block */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 20, 60, 0.6) 0%, rgba(20, 15, 40, 0.8) 100%)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
            </svg>
            <span style={{ fontSize: '1rem', fontWeight: '700', background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Серия заходов</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day, index) => (
              <div key={day} style={{
                width: '40px',
                height: '40px',
                borderRadius: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: '700',
                background: streak[index] ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' : 'rgba(255,255,255,0.05)',
                color: streak[index] ? 'white' : 'rgba(255,255,255,0.4)',
                boxShadow: streak[index] ? '0 0 15px rgba(245, 158, 11, 0.5)' : 'none',
                border: streak[index] ? '1px solid rgba(251, 191, 36, 0.5)' : '1px solid rgba(255,255,255,0.1)'
              }}>
                {streak[index] ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                  </svg>
                ) : day}
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#fbbf24', margin: 0 }}>
            {streak.filter(Boolean).length} из 7 дней
          </p>
        </div>

        {/* Total Stats */}
        <h2 style={{ marginTop: '2rem' }}>Общая статистика</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ 
            background: 'rgba(16, 185, 129, 0.1)', 
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{totalStats.correct}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Правильно</div>
          </div>
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f43f5e' }}>{totalStats.incorrect}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Неправильно</div>
          </div>
          <div style={{ 
            background: 'rgba(245, 158, 11, 0.1)', 
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{totalStats.hints}</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Подсказок</div>
          </div>
          <div style={{ 
            background: 'rgba(139, 92, 246, 0.1)', 
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8b5cf6' }}>{successRate}%</div>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Успешность</div>
          </div>
        </div>

        {/* Errors List */}
        <h2 style={{ marginTop: '1.5rem' }}>Ошибки ({errors.length})</h2>
        {errors.length > 0 ? (
          <ul style={{ maxHeight: '150px', overflow: 'auto', padding: 0, listStyle: 'none' }}>
            {errors.slice(0, 5).map((error, i) => (
              <li key={i} style={{ 
                color: 'rgba(255,255,255,0.8)',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {error.sentence} → <strong style={{ color: '#f43f5e' }}>{error.correctWord}</strong>
              </li>
            ))}
            {errors.length > 5 && <li style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textAlign: 'center' }}>...и ещё {errors.length - 5}</li>}
          </ul>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Нет ошибок! Отличная работа!</p>
        )}

        {/* Repeat List */}
        <h2 style={{ marginTop: '1.5rem' }}>Повторение ({repeat.length})</h2>
        {repeat.length > 0 ? (
          <ul style={{ maxHeight: '150px', overflow: 'auto', padding: 0, listStyle: 'none' }}>
            {repeat.slice(0, 5).map((item, i) => (
              <li key={i} style={{ 
                color: 'rgba(255,255,255,0.8)',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                {item.sentence} → <strong style={{ color: '#f59e0b' }}>{item.correctWord}</strong>
              </li>
            ))}
            {repeat.length > 5 && <li style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textAlign: 'center' }}>...и ещё {repeat.length - 5}</li>}
          </ul>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Пока нечего повторять.</p>
        )}

        {/* Recent Sessions */}
        <h2 style={{ marginTop: '1.5rem' }}>Недавние сессии</h2>
        {sessions.length > 0 ? (
          <ul style={{ padding: 0, listStyle: 'none' }}>
            {sessions.slice(-3).reverse().map((session, i) => (
              <li key={i} style={{ 
                color: 'rgba(255,255,255,0.8)',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '0.5rem',
                marginBottom: '0.5rem',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{new Date(session.date).toLocaleDateString()}</span>
                <span style={{ color: '#8b5cf6', fontWeight: '600' }}>Счёт: {session.stats.score.toFixed(1)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Пока нет сессий. Начните викторину!</p>
        )}

        {/* Navigation */}
        <div className="text-center" style={{ marginTop: '2rem' }}>
          <Link href="/map" className="glow-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"></polygon>
            </svg>
            <span>На карту</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
