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

export default function AdminPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')

  // Check admin access
  useEffect(() => {
    const userData = localStorage.getItem('currentUser')
    if (!userData) {
      router.push('/login')
      return
    }
    const user = JSON.parse(userData)
    if (!user.isAdmin) {
      router.push('/quiz')
      return
    }
    setCurrentUser(user)
  }, [router])

  // Load users
  useEffect(() => {
    const usersData = localStorage.getItem('users')
    if (usersData) {
      setUsers(JSON.parse(usersData))
    }
  }, [])

  const deleteUser = (username: string) => {
    if (username === 'admin') {
      setMessage('Нельзя удалить администратора!')
      setTimeout(() => setMessage(''), 3000)
      return
    }
    
    const updatedUsers = users.filter(u => u.username !== username)
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setMessage(`Пользователь ${username} удален`)
    setTimeout(() => setMessage(''), 3000)
  }

  const resetUserPassword = (username: string) => {
    const newPassword = prompt(`Введите новый пароль для ${username}:`)
    if (!newPassword || newPassword.length < 4) {
      setMessage('Пароль должен быть минимум 4 символа')
      setTimeout(() => setMessage(''), 3000)
      return
    }

    const updatedUsers = users.map(u => 
      u.username === username ? { ...u, password: newPassword } : u
    )
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setMessage(`Пароль для ${username} изменен`)
    setTimeout(() => setMessage(''), 3000)
  }

  const changeUserLevel = (username: string, newLevel: string) => {
    const updatedUsers = users.map(u => 
      u.username === username ? { ...u, level: newLevel } : u
    )
    setUsers(updatedUsers)
    localStorage.setItem('users', JSON.stringify(updatedUsers))
    setMessage(`Уровень ${username} изменен на ${newLevel}`)
    setTimeout(() => setMessage(''), 3000)
  }

  const logout = () => {
    localStorage.removeItem('currentUser')
    router.push('/login')
  }

  const getStats = () => {
    const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
    const totalStats = JSON.parse(localStorage.getItem('totalStats') || '{"correct":0,"incorrect":0,"hints":0,"score":0}')
    return { sessionsCount: sessions.length, ...totalStats }
  }

  const stats = getStats()

  if (!currentUser) {
    return (
      <main className="container">
        <div className="card text-center">
          <p>Загрузка...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="card card-wide">
        <div className="text-center" style={{ marginBottom: '0.5rem' }}>
          <Image 
            src="/logo.png" 
            alt="MemeLand Logo" 
            width={120} 
            height={80}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        <div className="flex flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ color: '#7c3aed' }}>⚙️ Панель администратора</h2>
          <button onClick={logout} className="btn btn-outline" style={{ fontSize: '0.875rem' }}>
            🚪 Выйти
          </button>
        </div>

        {message && <p className="success-msg text-center">{message}</p>}

        {/* Admin Info */}
        <div style={{ padding: '1rem', background: '#f5f3ff', borderRadius: '0.5rem', marginBottom: '1.5rem' }}>
          <p><strong>Администратор:</strong> {currentUser.username}</p>
          <p><strong>Всего пользователей:</strong> {users.length}</p>
        </div>

        {/* Global Stats */}
        <h2 style={{ marginBottom: '1rem' }}>📊 Общая статистика системы</h2>
        <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="stat-item">
            <div className="stat-value">{stats.sessionsCount}</div>
            <div className="stat-label">Сессий</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.correct}</div>
            <div className="stat-label">Правильных</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.incorrect}</div>
            <div className="stat-label">Ошибок</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.score.toFixed(1)}</div>
            <div className="stat-label">Общий счёт</div>
          </div>
        </div>

        {/* Users List */}
        <h2 style={{ marginBottom: '1rem' }}>👥 Пользователи</h2>
        {users.length === 0 ? (
          <p>Пользователей пока нет.</p>
        ) : (
          <div className="list" style={{ maxHeight: '400px', overflow: 'auto' }}>
            {users.map((user) => (
              <div key={user.username} className="list-item" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.5rem',
                padding: '1rem'
              }}>
                <div>
                  <p style={{ fontWeight: '600' }}>
                    {user.username} {user.isAdmin && <span style={{ color: '#f59e0b' }}>👑 Админ</span>}
                  </p>
                  <p className="text-sm" style={{ color: '#6b21a8' }}>
                    Уровень: {user.level} | Создан: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                </div>
                
                {!user.isAdmin && (
                  <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
                    <select 
                      value={user.level}
                      onChange={(e) => changeUserLevel(user.username, e.target.value)}
                      style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                    >
                      <option value="beginner">Начальный</option>
                      <option value="intermediate">Средний</option>
                      <option value="advanced">Продвинутый</option>
                    </select>
                    <button 
                      onClick={() => resetUserPassword(user.username)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                    >
                      🔑 Пароль
                    </button>
                    <button 
                      onClick={() => deleteUser(user.username)}
                      className="btn"
                      style={{ 
                        fontSize: '0.75rem', 
                        padding: '0.25rem 0.5rem',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                      }}
                    >
                      🗑️ Удалить
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <div className="flex gap-1" style={{ marginTop: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/constructor" className="btn btn-secondary">
            ➕ Управление мемами
          </Link>
          <Link href="/" className="btn btn-outline">
            🏠 На главную
          </Link>
        </div>
      </div>
    </main>
  )
}
