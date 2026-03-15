'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface Meme {
  id: number
  level: string
  quizLevel: number
  image: string
  correctWord: string
  translation: string
  sentence: string
  options: string[]
}

interface User {
  username: string
  password: string
  level: string
  isAdmin?: boolean
  createdAt: string
}

export default function SurvivalPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [memes, setMemes] = useState<Meme[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lives, setLives] = useState(3)
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showCorrect, setShowCorrect] = useState(false)
  const [lostLife, setLostLife] = useState<number | null>(null)

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

    fetch('/data/memes.json')
      .then((res) => res.json())
      .then((data: Meme[]) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 9)
        setMemes(shuffled)
      })
  }, [router])

  const currentMeme = memes[currentIndex]

  const handleAnswer = (answer: string) => {
    if (!currentMeme || gameOver) return
    setSelectedAnswer(answer)

    if (answer === currentMeme.correctWord) {
      setScore(score + 1)
      setTimeout(() => {
        setSelectedAnswer('')
        setShowCorrect(false)
        setCurrentIndex(currentIndex + 1)
      }, 500)
    } else {
      setShowCorrect(true)
      const newLives = lives - 1
      setLostLife(lives - 1)
      setLives(newLives)
      
      setTimeout(() => {
        setLostLife(null)
        if (newLives <= 0) {
          setGameOver(true)
        } else {
          setTimeout(() => {
            setSelectedAnswer('')
            setShowCorrect(false)
            setCurrentIndex(currentIndex + 1)
          }, 1000)
        }
      }, 600)
    }
  }

  const resetGame = () => {
    setLives(3)
    setScore(0)
    setCurrentIndex(0)
    setGameOver(false)
    setSelectedAnswer('')
    setShowCorrect(false)
    setLostLife(null)
    fetch('/data/memes.json')
      .then((res) => res.json())
      .then((data: Meme[]) => {
        const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 9)
        setMemes(shuffled)
      })
  }

  if (!user || memes.length === 0) {
    return (
      <main className="container">
        <div className="card text-center">
          <p>Загрузка...</p>
        </div>
      </main>
    )
  }

  if (gameOver) {
    return (
      <main className="container">
        <div className="card text-center" style={{ border: '1px solid rgba(244, 63, 94, 0.5)', boxShadow: '0 0 40px rgba(244, 63, 94, 0.2)' }}>
          <div style={{ marginBottom: '1rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" style={{ margin: '0 auto' }}>
              <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
              <path d="M8.5 8.5v.01"></path>
              <path d="M16 15.5v.01"></path>
              <path d="M12 12v.01"></path>
              <path d="M11 17v.01"></path>
              <path d="M7 14v.01"></path>
            </svg>
          </div>
          <h1 style={{ color: '#f43f5e', marginBottom: '0.5rem' }}>Игра окончена!</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Вы потеряли все жизни
          </p>
          <div style={{ 
            background: 'rgba(139, 92, 246, 0.1)', 
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem 2rem',
            marginBottom: '2rem'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Итоговый счёт</span>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#8b5cf6' }}>{score}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="glow-btn glow-btn-red" onClick={resetGame}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              <span>Играть снова</span>
            </button>
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

  return (
    <main className="container">
      <div className="card card-wide" style={{ border: '1px solid rgba(244, 63, 94, 0.4)' }}>
        {/* Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            <h1 style={{ color: '#f43f5e', fontSize: '1.5rem' }}>Режим выживания</h1>
          </div>
          
          {/* Lives */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{
                  transition: 'all 0.6s ease',
                  transform: lostLife === i ? 'scale(0) rotate(180deg)' : 'scale(1)',
                  opacity: i < lives ? 1 : 0.2
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill={i < lives ? '#f43f5e' : 'none'} stroke="#f43f5e" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </div>
            ))}
          </div>
          
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem'
          }}>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Счёт: </span>
            <span style={{ color: '#f43f5e', fontWeight: '700', fontSize: '1.1rem' }}>{score}</span>
          </div>
          
          <Link href="/map" className="glow-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"></polygon>
            </svg>
            <span>На карту</span>
          </Link>
        </div>

        {/* Progress bar - survival style */}
        <div style={{
          width: '100%',
          height: '8px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #f43f5e 0%, #fb7185 100%)',
            boxShadow: '0 0 10px rgba(244, 63, 94, 0.5)',
            transition: 'width 0.3s ease',
            width: `${Math.min(((currentIndex + 1) / memes.length) * 100, 100)}%`
          }} />
        </div>

        {/* Meme Image */}
        <div className="text-center" style={{ marginBottom: '1.5rem' }}>
          {currentMeme.image ? (
            <Image
              src={currentMeme.image}
              alt="Мем"
              width={400}
              height={300}
              style={{ 
                maxWidth: '100%', 
                height: 'auto',
                borderRadius: '1rem',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                boxShadow: '0 0 30px rgba(244, 63, 94, 0.2)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '400px',
              height: '300px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
          )}
        </div>

        {/* Sentence */}
        <p style={{ textAlign: 'center', fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: '600', color: 'white' }}>
          {currentMeme.sentence}
        </p>

        {/* Translation */}
        <p style={{ textAlign: 'center', fontSize: '0.95rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.5)' }}>
          {currentMeme.sentence.split('___').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span style={{ color: '#f43f5e', fontWeight: '600' }}>{currentMeme.translation}</span>}
            </span>
          ))}
        </p>

        {/* Show correct answer if wrong */}
        {showCorrect && (
          <div style={{ 
            background: 'rgba(244, 63, 94, 0.1)', 
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '0.75rem',
            padding: '1rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" style={{ marginRight: '0.5rem', display: 'inline' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <span style={{ color: 'rgba(255,255,255,0.8)' }}>Неправильно! Правильный ответ: </span>
            <strong style={{ color: '#f43f5e' }}>{currentMeme.correctWord}</strong>
          </div>
        )}

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {currentMeme.options.map((option) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentMeme.correctWord
            
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== ''}
                style={{
                  padding: '1rem 1.5rem',
                  border: '1px solid',
                  borderColor: isSelected 
                    ? isCorrect ? 'rgba(16, 185, 129, 0.6)' : 'rgba(244, 63, 94, 0.6)'
                    : 'rgba(244, 63, 94, 0.3)',
                  borderRadius: '0.75rem',
                  background: isSelected
                    ? isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'
                    : 'rgba(244, 63, 94, 0.1)',
                  color: isSelected
                    ? isCorrect ? '#10b981' : '#f43f5e'
                    : 'white',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: selectedAnswer === '' ? 'pointer' : 'not-allowed',
                  boxShadow: isSelected
                    ? isCorrect ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 0 20px rgba(244, 63, 94, 0.3)'
                    : '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease'
                }}
              >
                {option}
              </button>
            )
          })}
        </div>
      </div>
    </main>
  )
}
