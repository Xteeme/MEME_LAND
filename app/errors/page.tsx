'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface ErrorItem {
  id: number
  sentence: string
  correctWord: string
  translation: string
  explanation: string
  image: string
}

interface User {
  username: string
  password: string
  level: string
  isAdmin?: boolean
  createdAt: string
}

export default function ErrorsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [errors, setErrors] = useState<ErrorItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [completed, setCompleted] = useState<number[]>([])

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

    const savedErrors = localStorage.getItem(`errors_${parsedUser.username}`)
    if (savedErrors) {
      setErrors(JSON.parse(savedErrors))
    }
  }, [router])

  const currentError = errors[currentIndex]

  const handleNext = () => {
    if (!completed.includes(currentError.id)) {
      setCompleted([...completed, currentError.id])
    }
    setShowExplanation(false)
    if (currentIndex < errors.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleRemoveFromErrors = () => {
    const newErrors = errors.filter((e) => e.id !== currentError.id)
    setErrors(newErrors)
    localStorage.setItem(`errors_${user?.username}`, JSON.stringify(newErrors))
    setShowExplanation(false)
    if (currentIndex >= newErrors.length) {
      setCurrentIndex(Math.max(0, newErrors.length - 1))
    }
  }

  const handleClearAllErrors = () => {
    if (confirm('Вы уверены, что хотите удалить все ошибки?')) {
      setErrors([])
      localStorage.setItem(`errors_${user?.username}`, JSON.stringify([]))
      setCurrentIndex(0)
      setCompleted([])
    }
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

  if (errors.length === 0) {
    return (
      <main className="container">
        <div className="card text-center">
          <div style={{ marginBottom: '1rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ margin: '0 auto' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <h1 style={{ color: '#10b981' }}>Нет ошибок!</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Отличная работа! Вы ещё не совершили ошибок.</p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/quiz" className="btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>Викторина</span>
            </Link>
            <Link href="/profile" className="btn btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Профиль</span>
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const progress = Math.round((completed.length / errors.length) * 100)

  return (
    <main className="container">
      <div className="card card-wide">
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

        {/* Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Отработка ошибок</h1>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>{user.username}</span>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <Link href="/quiz" className="glow-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <span>Викторина</span>
            </Link>
            <Link href="/profile" className="glow-btn glow-btn-white" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <span>Профиль</span>
            </Link>
          </div>
        </div>

        {/* Progress */}
        <div style={{ 
          width: '100%', 
          height: '8px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '0.75rem'
        }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)',
            borderRadius: '4px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)',
            width: `${progress}%` 
          }} />
        </div>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
          Изучено {completed.length} из {errors.length} ошибок ({progress}%)
        </p>

        {/* Error Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 20, 60, 0.6) 0%, rgba(20, 15, 40, 0.8) 100%)',
          padding: '1.5rem',
          borderRadius: '1rem',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          marginBottom: '1.5rem',
          boxShadow: '0 0 30px rgba(245, 158, 11, 0.1)'
        }}>
          {/* Image */}
          {currentError.image && (
            <div className="text-center" style={{ marginBottom: '1rem' }}>
              <Image
                src={currentError.image}
                alt="Мем"
                width={300}
                height={200}
                style={{ 
                  maxWidth: '100%', 
                  height: 'auto',
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(245, 158, 11, 0.2)'
                }}
              />
            </div>
          )}

          {/* Sentence with blank */}
          <p style={{ 
            color: 'white', 
            fontSize: '1.1rem', 
            textAlign: 'center',
            marginBottom: '1rem',
            lineHeight: '1.8',
            fontWeight: '500'
          }}>
            {currentError.sentence.split('_____').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span style={{ 
                    color: '#f59e0b', 
                    fontWeight: '700',
                    borderBottom: '2px solid #f59e0b'
                  }}>
                    {currentError.correctWord}
                  </span>
                )}
              </span>
            ))}
          </p>

          {/* Show Explanation Button */}
          {!showExplanation ? (
            <div className="text-center">
              <button 
                className="glow-btn glow-btn-orange" 
                onClick={() => setShowExplanation(true)}
                style={{ marginTop: '0.5rem' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
                <span>Показать объяснение</span>
              </button>
            </div>
          ) : (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginTop: '1rem',
              border: '1px solid rgba(245, 158, 11, 0.3)'
            }}>
              <h3 style={{ 
                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem', 
                fontSize: '1rem' 
              }}>Объяснение</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', marginBottom: '0.75rem' }}>
                <strong style={{ color: '#fbbf24' }}>{currentError.correctWord}</strong> — {currentError.translation}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>{currentError.explanation}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {showExplanation && (
            <>
              <button className="btn" onClick={handleNext}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
                <span>Продолжить</span>
              </button>
              <button className="glow-btn glow-btn-red" onClick={handleRemoveFromErrors}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Удалить из ошибок</span>
              </button>
            </>
          )}
        </div>

        {/* Clear All */}
        <div className="text-center" style={{ marginTop: '2rem' }}>
          <button 
            onClick={handleClearAllErrors}
            style={{ 
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            Очистить все ошибки
          </button>
        </div>

        {/* Error List */}
        <div style={{ marginTop: '2rem' }}>
          <h3 style={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem', 
            textAlign: 'center' 
          }}>Список ошибок</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
            {errors.map((error, index) => (
              <button
                key={error.id}
                onClick={() => {
                  setCurrentIndex(index)
                  setShowExplanation(false)
                }}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid',
                  borderColor: index === currentIndex ? 'rgba(139, 92, 246, 0.6)' : completed.includes(error.id) ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.1)',
                  background: index === currentIndex ? 'rgba(139, 92, 246, 0.3)' : completed.includes(error.id) ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)',
                  color: index === currentIndex ? 'white' : completed.includes(error.id) ? '#10b981' : 'rgba(255,255,255,0.7)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
              >
                {completed.includes(error.id) ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ display: 'inline', marginRight: '0.25rem' }}>
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : index + 1}. {error.correctWord}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
