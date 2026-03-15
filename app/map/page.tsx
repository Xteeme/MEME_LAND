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

interface Level {
  id: number
  name: string
  x: number
  y: number
  unlocked: boolean
  completed: boolean
}

interface LeaderboardEntry {
  username: string
  completedLevels: number
  totalScore: number
}

export default function MapPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Sample levels - will be expanded later with actual quizzes
  const [levels, setLevels] = useState<Level[]>([
    { id: 1, name: 'Уровень 1', x: 50, y: 85, unlocked: true, completed: false },
    { id: 2, name: 'Уровень 2', x: 30, y: 70, unlocked: false, completed: false },
    { id: 3, name: 'Уровень 3', x: 70, y: 60, unlocked: false, completed: false },
    { id: 4, name: 'Уровень 4', x: 45, y: 45, unlocked: false, completed: false },
    { id: 5, name: 'Уровень 5', x: 75, y: 35, unlocked: false, completed: false },
    { id: 6, name: 'Уровень 6', x: 25, y: 25, unlocked: false, completed: false },
    { id: 7, name: 'Уровень 7', x: 55, y: 15, unlocked: false, completed: false },
    { id: 8, name: 'Босс', x: 50, y: 5, unlocked: false, completed: false },
  ])

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

    // Load progress from localStorage
    const progress = localStorage.getItem(`progress_${parsedUser.username}`)
    if (progress) {
      const completedLevels = JSON.parse(progress)
      setLevels(prev => prev.map(level => ({
        ...level,
        unlocked: level.id === 1 || completedLevels.includes(level.id - 1),
        completed: completedLevels.includes(level.id)
      })))
    }
  }, [router])

  // Load leaderboard
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const leaderboardData: LeaderboardEntry[] = users
      .filter((u: User) => !u.isAdmin)
      .map((u: User) => {
        const progress = JSON.parse(localStorage.getItem(`progress_${u.username}`) || '[]')
        const totalStats = JSON.parse(localStorage.getItem(`stats_${u.username}`) || '{"score":0}')
        return {
          username: u.username,
          completedLevels: progress.length,
          totalScore: totalStats.score || 0
        }
      })
      .sort((a: LeaderboardEntry, b: LeaderboardEntry) => {
        if (b.completedLevels !== a.completedLevels) {
          return b.completedLevels - a.completedLevels
        }
        return b.totalScore - a.totalScore
      })
      .slice(0, 5)
    setLeaderboard(leaderboardData)
  }, [])

  const handleLevelClick = (level: Level) => {
    if (level.unlocked && !level.completed) {
      router.push(`/quiz?level=${level.id}`)
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

  return (
    <>
      {/* Top Navigation Bar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#37464f',
        padding: '0.5rem 1rem',
        boxShadow: '0 4px 0 #202f36',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '4px solid #8b5cf6'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image 
            src="/logo.png" 
            alt="MemeLand Logo" 
            width={80} 
            height={50}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
        
        {/* Desktop Menu */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }} className="desktop-menu">
          <Link href="/survival" className="glow-btn glow-btn-red">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Выживание</span>
          </Link>
          <Link href="/dictionary" className="glow-btn glow-btn-green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Словарь</span>
          </Link>
          <Link href="/errors" className="glow-btn glow-btn-orange">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Ошибки</span>
          </Link>
          <Link href="/profile" className="glow-btn glow-btn-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Профиль</span>
          </Link>
          <button onClick={logout} className="glow-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Выйти</span>
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mobile-menu-btn"
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            zIndex: 101
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isMenuOpen ? (
              <><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></>
            ) : (
              <><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></>
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: '60px',
          left: 0,
          right: 0,
          background: 'linear-gradient(135deg, rgba(30, 20, 60, 0.98) 0%, rgba(20, 15, 40, 0.98) 100%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          zIndex: 99,
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          borderBottom: '2px solid rgba(139, 92, 246, 0.5)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(139, 92, 246, 0.3)'
        }} className="mobile-menu">
          <Link href="/survival" className="glow-btn glow-btn-red" style={{ 
            justifyContent: 'center',
            width: '100%',
            padding: '0.875rem 1.5rem'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <span>Выживание</span>
          </Link>
          <Link href="/dictionary" className="glow-btn glow-btn-green" style={{ 
            justifyContent: 'center',
            width: '100%',
            padding: '0.875rem 1.5rem'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span>Словарь</span>
          </Link>
          <Link href="/errors" className="glow-btn glow-btn-orange" style={{ 
            justifyContent: 'center',
            width: '100%',
            padding: '0.875rem 1.5rem'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>Ошибки</span>
          </Link>
          <Link href="/profile" className="glow-btn glow-btn-white" style={{ 
            justifyContent: 'center',
            width: '100%',
            padding: '0.875rem 1.5rem'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <span>Профиль</span>
          </Link>
          <button onClick={logout} className="glow-btn" style={{ 
            justifyContent: 'center',
            width: '100%',
            padding: '0.875rem 1.5rem'
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Выйти</span>
          </button>
        </div>
      )}

      <main className="container" style={{ paddingTop: '6rem', minHeight: '100vh', display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
        {/* Main Card with Map */}
        <div className="card card-wide" style={{ minHeight: '70vh', position: 'relative', margin: '0', flex: '0 0 auto' }}>
          {/* Welcome message */}
          <p style={{ marginBottom: '1rem', textAlign: 'center', fontSize: '1.1rem' }}>
            Привет, <strong>{user.username}</strong>! Выбери уровень, чтобы начать квиз.
          </p>

          {/* Map Container */}
          <div className="level-map">
          {/* Path connecting levels */}
          <svg 
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%', 
              pointerEvents: 'none' 
            }}
          >
            {levels.map((level, index) => {
              if (index === levels.length - 1) return null
              const nextLevel = levels[index + 1]
              return (
                <line
                  key={`path-${level.id}`}
                  x1={`${level.x}%`}
                  y1={`${level.y}%`}
                  x2={`${nextLevel.x}%`}
                  y2={`${nextLevel.y}%`}
                  className={`level-path ${level.completed ? 'completed' : ''}`}
                  strokeDasharray={level.completed ? '0' : '12,6'}
                />
              )
            })}
          </svg>

          {/* Level buttons */}
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() => handleLevelClick(level)}
              disabled={!level.unlocked}
              className={`level-btn ${level.completed ? 'completed' : level.unlocked ? 'unlocked' : 'locked'} ${level.id === 8 ? 'boss' : ''}`}
              style={{
                left: `${level.x}%`,
                top: `${level.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {level.completed ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              ) : level.id === 8 ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              ) : level.unlocked ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor" stroke="none">{level.id}</text>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              )}
            </button>
          ))}

          {/* Decorative elements - replaced with SVG shapes */}
          <div style={{ position: 'absolute', left: '8%', top: '15%', width: '30px', height: '30px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)', filter: 'blur(5px)' }}></div>
          <div style={{ position: 'absolute', right: '12%', top: '25%', width: '40px', height: '40px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)', filter: 'blur(8px)' }}></div>
          <div style={{ position: 'absolute', left: '18%', top: '45%', width: '25px', height: '25px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, transparent 70%)', filter: 'blur(4px)' }}></div>
          <div style={{ position: 'absolute', right: '8%', top: '55%', width: '35px', height: '35px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, transparent 70%)', filter: 'blur(6px)' }}></div>
        </div>

        {/* Legend */}
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>Доступен</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)' }}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.8)' }}>Пройден</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'rgba(255,255,255,0.5)' }}>Заблокирован</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Block */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 20, 60, 0.8) 0%, rgba(20, 15, 40, 0.9) 100%)',
        padding: '1.5rem',
        borderRadius: '1rem',
        border: '1px solid rgba(139, 92, 246, 0.3)',
        boxShadow: '0 0 40px rgba(139, 92, 246, 0.1), 0 8px 32px rgba(0, 0, 0, 0.4)',
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        margin: '0',
        alignSelf: 'center',
        minWidth: '280px',
        minHeight: '70vh',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
            <path d="M4 22h16"></path>
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
          </svg>
          <span style={{ fontSize: '1rem', fontWeight: '700', background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Начальная лига</span>
        </div>
        <div style={{ width: '100%' }}>
          {leaderboard.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Пока нет данных</p>
          ) : (
            leaderboard.map((entry, index) => (
              <div key={entry.username} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                background: index === 0 ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.1) 100%)' : index === 1 ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 100%)' : index === 2 ? 'linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(167, 139, 250, 0.1) 100%)' : 'rgba(255,255,255,0.05)',
                borderRadius: '0.75rem',
                marginBottom: '0.5rem',
                border: index < 3 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05)',
                boxShadow: index < 3 ? '0 0 15px rgba(139, 92, 246, 0.2)' : 'none'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '800',
                    color: index === 0 ? '#fbbf24' : index === 1 ? '#a78bfa' : index === 2 ? '#c4b5fd' : 'rgba(255,255,255,0.5)'
                  }}>#{index + 1}</span>
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600',
                    color: 'white'
                  }}>{entry.username}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '500',
                    color: 'rgba(255,255,255,0.6)'
                  }}>{entry.completedLevels} ур.</div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    color: '#8b5cf6'
                  }}>{entry.totalScore.toFixed(1)} очк.</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
    </>
  )
}
