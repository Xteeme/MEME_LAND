'use client'

import { useState, useEffect, Suspense } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

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

interface Stats {
  correct: number
  incorrect: number
  hints: number
  score: number
}

type Tab = 'quiz' | 'errors' | 'repeat'

function QuizContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const levelParam = searchParams.get('level')
  const quizLevel = levelParam ? parseInt(levelParam) : 1
  
  const [user, setUser] = useState<User | null>(null)
  const [memes, setMemes] = useState<Meme[]>([])
  const [errors, setErrors] = useState<Meme[]>([])
  const [repeat, setRepeat] = useState<Meme[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<Tab>('quiz')
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showCorrect, setShowCorrect] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [hintMessage, setHintMessage] = useState('')
  const [hasMistakeOnCurrent, setHasMistakeOnCurrent] = useState(false)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [stats, setStats] = useState<Stats>({ correct: 0, incorrect: 0, hints: 0, score: 0 })
  const [showRehabModal, setShowRehabModal] = useState(false)

  // Load user and data
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
    if (savedErrors) setErrors(JSON.parse(savedErrors))
    
    const savedRepeat = localStorage.getItem(`repeat_${parsedUser.username}`)
    if (savedRepeat) setRepeat(JSON.parse(savedRepeat))
  }, [router])

  // Load memes based on user level and quiz level
  useEffect(() => {
    if (user) {
      fetch('/data/memes.json')
        .then((res) => res.json())
        .then((data: Meme[]) => {
          const filtered = data.filter((m) => m.quizLevel === quizLevel)
          setMemes(filtered)
        })
    }
  }, [user, quizLevel])

  // Save errors and repeat to localStorage
  const persistData = () => {
    localStorage.setItem('errors', JSON.stringify(errors))
    localStorage.setItem('repeat', JSON.stringify(repeat))
  }

  // Get current meme based on active tab
  const getCurrentList = () => {
    if (activeTab === 'errors') return errors
    if (activeTab === 'repeat') return repeat
    return memes
  }
  
  const currentList = getCurrentList()
  const currentMeme = currentList[currentIndex]

  // Handle answer selection
  const handleAnswer = (answer: string) => {
    if (!currentMeme) return
    setSelectedAnswer(answer)

    if (answer === currentMeme.correctWord) {
      // Correct answer
      if (activeTab === 'errors') {
        setShowRehabModal(true)
      } else {
        setStats((prev) => ({
          ...prev,
          correct: prev.correct + (hintUsed ? 0 : 1),
          score: prev.score + (hintUsed ? 0.5 : 1),
        }))
        // Add to dictionary if correct on first try without hints
        if (activeTab === 'quiz' && !hintUsed && !hasMistakeOnCurrent && user) {
          const dictKey = `dictionary_${user.username}`
          const dictionary = JSON.parse(localStorage.getItem(dictKey) || '[]')
          if (!dictionary.find((e: any) => e.id === currentMeme.id)) {
            const newEntry = {
              id: currentMeme.id,
              word: currentMeme.correctWord,
              translation: currentMeme.translation,
              image: currentMeme.image,
              learnedAt: new Date().toISOString()
            }
            dictionary.push(newEntry)
            localStorage.setItem(dictKey, JSON.stringify(dictionary))
          }
        }
        // Reset for next question after a short delay to show correct highlight
        setTimeout(() => {
          goToNext()
        }, 800)
      }
    } else {
      // Wrong answer - just mark as wrong, don't go to next
      setShowCorrect(true)
      if (!hasMistakeOnCurrent) {
        setStats((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }))
        if (activeTab === 'quiz' && !errors.find((e) => e.id === currentMeme.id)) {
          const newErrors = [...errors, currentMeme]
          setErrors(newErrors)
          localStorage.setItem(`errors_${user?.username}`, JSON.stringify(newErrors))
        }
        setHasMistakeOnCurrent(true)
      }
      // Don't go to next - let user try again
    }
  }

  // Use hint
  const useHint = () => {
    if (!currentMeme) return
    setStats((prev) => ({ ...prev, hints: prev.hints + 1 }))
    setHintUsed(true)
    setHintMessage(`💡 Hint: The missing word is "${currentMeme.correctWord}"`)
    
    // Add to repeat list
    if (!repeat.find((r) => r.id === currentMeme.id)) {
      const newRepeat = [...repeat, currentMeme]
      setRepeat(newRepeat)
      localStorage.setItem(`repeat_${user?.username}`, JSON.stringify(newRepeat))
    }
  }

  // Go to next question
  const goToNext = () => {
    if (currentIndex < currentList.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer('')
      setShowCorrect(false)
      setHintUsed(false)
      setHintMessage('')
      setHasMistakeOnCurrent(false)
    } else {
      // Session complete
      if (activeTab === 'quiz' && user) {
        // Save session stats (user-specific)
        const sessionsKey = `sessions_${user.username}`
        const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]')
        sessions.push({ date: new Date().toISOString(), stats, level: user.level })
        localStorage.setItem(sessionsKey, JSON.stringify(sessions))
        
        // Update total stats (user-specific)
        const statsKey = `stats_${user.username}`
        const total = JSON.parse(localStorage.getItem(statsKey) || '{"correct":0,"incorrect":0,"hints":0,"score":0}')
        total.correct += stats.correct
        total.incorrect += stats.incorrect
        total.hints += stats.hints
        total.score += stats.score
        localStorage.setItem(statsKey, JSON.stringify(total))
        
        // Mark current quiz level as completed
        const progressKey = `progress_${user.username}`
        const completedLevels = JSON.parse(localStorage.getItem(progressKey) || '[]')
        if (!completedLevels.includes(quizLevel)) {
          completedLevels.push(quizLevel)
          localStorage.setItem(progressKey, JSON.stringify(completedLevels))
        }
        
        // Save streak for today
        const streakKey = `streak_${user.username}`
        const streak = JSON.parse(localStorage.getItem(streakKey) || '[false,false,false,false,false,false,false]')
        const today = new Date().getDay()
        const adjustedToday = today === 0 ? 6 : today - 1
        streak[adjustedToday] = true
        localStorage.setItem(streakKey, JSON.stringify(streak))
        localStorage.setItem(`lastCompleted_${user.username}`, new Date().toISOString())
      }
      setSessionComplete(true)
    }
  }

  // Handle rehabilitation choice
  const handleRehabChoice = (remove: boolean) => {
    if (remove) {
      const newErrors = errors.filter((e) => e.id !== currentMeme.id)
      setErrors(newErrors)
      localStorage.setItem(`errors_${user?.username}`, JSON.stringify(newErrors))
    } else {
      const newErrors = errors.filter((e) => e.id !== currentMeme.id)
      setErrors(newErrors)
      localStorage.setItem(`errors_${user?.username}`, JSON.stringify(newErrors))
      if (!repeat.find((r) => r.id === currentMeme.id)) {
        const newRepeat = [...repeat, currentMeme]
        setRepeat(newRepeat)
        localStorage.setItem(`repeat_${user?.username}`, JSON.stringify(newRepeat))
      }
    }
    setShowRehabModal(false)
    goToNext()
  }

  // Switch tab
  const switchTab = (tab: Tab) => {
    setActiveTab(tab)
    setCurrentIndex(0)
    setSelectedAnswer('')
    setShowCorrect(false)
    setHintUsed(false)
    setHintMessage('')
    setHasMistakeOnCurrent(false)
    setSessionComplete(false)
    setStats({ correct: 0, incorrect: 0, hints: 0, score: 0 })
  }

  // Reset session
  const resetSession = () => {
    setCurrentIndex(0)
    setSelectedAnswer('')
    setShowCorrect(false)
    setHintUsed(false)
    setHintMessage('')
    setHasMistakeOnCurrent(false)
    setSessionComplete(false)
    setStats({ correct: 0, incorrect: 0, hints: 0, score: 0 })
  }

  // Loading state
  if (!user) {
    return (
      <main className="container">
        <div className="card text-center">
          <p>Загрузка...</p>
        </div>
      </main>
    )
  }

  // No memes state
  if (!currentMeme && !sessionComplete) {
    return (
      <main className="container">
        <div className="card text-center">
          <h1>MemeLingo Викторина</h1>
          <div className="tabs">
            <button className={`tab ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => switchTab('quiz')}>Викторина</button>
            <button className={`tab ${activeTab === 'errors' ? 'active' : ''}`} onClick={() => switchTab('errors')}>Ошибки ({errors.length})</button>
            <button className={`tab ${activeTab === 'repeat' ? 'active' : ''}`} onClick={() => switchTab('repeat')}>Повторение ({repeat.length})</button>
          </div>
          <p style={{ marginTop: '1rem' }}>
            {activeTab === 'quiz' && 'Нет мемов для вашего уровня. Добавьте их в Конструкторе!'}
            {activeTab === 'errors' && 'Пока нет ошибок! Отличная работа! 🎉'}
            {activeTab === 'repeat' && 'Нечего повторять. Продолжайте учиться! 📚'}
          </p>
          {activeTab === 'quiz' && (
            <a href="/constructor" className="btn" style={{ marginTop: '1rem', display: 'inline-block' }}>Добавить мемы</a>
          )}
        </div>
      </main>
    )
  }

  // Session complete state
  if (sessionComplete) {
    const totalQuestions = currentList.length || 1
    const successPercent = Math.round((stats.score / totalQuestions) * 100)

    return (
      <main className="container">
        <div className="card text-center">
          <div style={{ marginBottom: '1rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto', maxWidth: '100%', height: 'auto' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="url(#trophyGradient)" strokeWidth="1.5" style={{ margin: '0 auto', maxWidth: '100%', height: 'auto' }}>
              <defs>
                <linearGradient id="trophyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
              <path d="M4 22h16"></path>
              <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
              <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
          </div>
          <h1 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)', marginBottom: '0.5rem' }}>Поздравляем!</h1>
          <p style={{ marginBottom: '1.5rem', color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(0.9rem, 3vw, 1rem)' }}>Ты круто справился, {user.username}! Продолжай в том же духе!</p>
          
          <div className="stats-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.1)', 
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#10b981' }}>{stats.correct}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Правильно</div>
            </div>
            <div style={{ 
              background: 'rgba(244, 63, 94, 0.1)', 
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f43f5e' }}>{stats.incorrect}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Неправильно</div>
            </div>
            <div style={{ 
              background: 'rgba(245, 158, 11, 0.1)', 
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#f59e0b' }}>{stats.hints}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Подсказок</div>
            </div>
            <div style={{ 
              background: 'rgba(139, 92, 246, 0.1)', 
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '0.75rem',
              padding: '1rem'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#8b5cf6' }}>{successPercent}%</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>Успешность</div>
            </div>
          </div>

          <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
            Итоговый счёт: <strong style={{ color: '#8b5cf6', fontSize: '1.3rem' }}>{stats.score.toFixed(1)}</strong> / {totalQuestions}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/map" className="btn" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', border: 'none', fontSize: 'clamp(0.85rem, 3vw, 1rem)', padding: 'clamp(0.75rem, 2vw, 0.875rem) clamp(1rem, 3vw, 1.5rem)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)' }}>
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
              <span>Супер!</span>
            </a>
          </div>
        </div>
      </main>
    )
  }

  // Main quiz UI
  return (
    <main className="container">
      <div className="card card-wide">
        {/* Logo */}
        <div className="text-center" style={{ marginBottom: 'clamp(0.5rem, 2vw, 1rem)' }}>
          <Image 
            src="/logo.png" 
            alt="MemeLand Logo" 
            width={100} 
            height={65}
            style={{ 
              maxWidth: 'clamp(60px, 20vw, 100px)', 
              height: 'auto', 
              filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.4))' 
            }}
          />
        </div>

        {/* Header */}
        <div style={{ marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'clamp(0.5rem, 2vw, 0.75rem)' }}>
          <span style={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>{user.level}</span>
          <a href="/map" className="glow-btn" style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.8rem)', padding: 'clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.75rem, 2.5vw, 1rem)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 'clamp(14px, 4vw, 16px)', height: 'clamp(14px, 4vw, 16px)' }}>
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Назад</span>
          </a>
        </div>

        {/* Stats counter */}
        <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', justifyContent: 'center', marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)', fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)' }}>
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {stats.correct}
          </span>
          <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            {stats.incorrect}
          </span>
          <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            {stats.hints}
          </span>
        </div>

        {/* Progress */}
        <div style={{ 
          width: '100%', 
          height: 'clamp(6px, 2vw, 8px)', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: 'clamp(3px, 1vw, 4px)',
          overflow: 'hidden',
          marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)'
        }}>
          <div style={{ 
            height: '100%', 
            background: 'linear-gradient(90deg, #8b5cf6 0%, #06b6d4 100%)',
            borderRadius: 'clamp(3px, 1vw, 4px)',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
            width: `${((currentIndex + 1) / currentList.length) * 100}%` 
          }} />
        </div>
        <p style={{ textAlign: 'center', fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)', marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)', color: 'rgba(255,255,255,0.5)' }}>
          Вопрос {currentIndex + 1} из {currentList.length}
        </p>

        {/* Meme Image */}
        <div className="text-center" style={{ marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)' }}>
          <Image
            src={currentMeme.image}
            alt="Мем"
            width={400}
            height={300}
            style={{ 
              maxWidth: '100%', 
              height: 'auto', 
              maxHeight: 'clamp(180px, 50vw, 300px)',
              borderRadius: 'clamp(0.5rem, 2vw, 1rem)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 30px rgba(139, 92, 246, 0.2)'
            }}
          />
        </div>

        {/* Sentence */}
        <p style={{ textAlign: 'center', fontSize: 'clamp(1rem, 3.5vw, 1.25rem)', marginBottom: 'clamp(0.5rem, 2vw, 0.75rem)', fontWeight: '600', color: 'white' }}>
          {currentMeme.sentence}
        </p>

        {/* Translation */}
        <p style={{ textAlign: 'center', fontSize: 'clamp(0.8rem, 2.5vw, 0.95rem)', marginBottom: 'clamp(0.75rem, 2vw, 1.5rem)', color: 'rgba(255,255,255,0.5)' }}>
          {currentMeme.sentence.split('___').map((part, i, arr) => (
            <span key={i}>
              {part}
              {i < arr.length - 1 && <span style={{ color: '#8b5cf6', fontWeight: '600' }}>{currentMeme.translation}</span>}
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
            <strong style={{ color: '#8b5cf6' }}>{currentMeme.correctWord}</strong>
          </div>
        )}

        {/* Options */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'clamp(0.5rem, 2vw, 0.75rem)', marginBottom: 'clamp(0.75rem, 2vw, 1rem)' }}>
          {currentMeme.options.map((option) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentMeme.correctWord
            const isWrongSelected = isSelected && !isCorrect
            const wasWrong = selectedAnswer !== '' && !isCorrect && isSelected
            const showCorrect = selectedAnswer !== '' && isCorrect
            
            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={wasWrong}
                style={{
                  padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.5rem)',
                  border: '1px solid',
                  borderColor: wasWrong ? 'rgba(244, 63, 94, 0.6)' : showCorrect ? 'rgba(16, 185, 129, 0.6)' : 'rgba(139, 92, 246, 0.3)',
                  borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
                  background: wasWrong ? 'rgba(244, 63, 94, 0.2)' : showCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.1)',
                  color: wasWrong ? '#f43f5e' : showCorrect ? '#10b981' : 'white',
                  fontSize: 'clamp(0.85rem, 3vw, 1rem)',
                  fontWeight: '600',
                  cursor: wasWrong ? 'not-allowed' : 'pointer',
                  boxShadow: wasWrong ? '0 0 20px rgba(244, 63, 94, 0.3)' : showCorrect ? '0 0 20px rgba(16, 185, 129, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  minHeight: 'clamp(50px, 12vw, 60px)'
                }}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Hint */}
        <div className="text-center" style={{ marginTop: 'clamp(0.75rem, 2vw, 1rem)' }}>
          {!hintUsed ? (
            <button className="glow-btn glow-btn-orange" onClick={useHint} style={{ fontSize: 'clamp(0.7rem, 2.5vw, 0.85rem)', padding: 'clamp(0.5rem, 1.5vw, 0.6rem) clamp(0.75rem, 2.5vw, 1.2rem)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 'clamp(14px, 4vw, 18px)', height: 'clamp(14px, 4vw, 18px)' }}>
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <span>Подсказка (0.5 балла)</span>
            </button>
          ) : (
            <div style={{ 
              background: 'rgba(245, 158, 11, 0.1)', 
              border: '1px solid rgba(245, 158, 11, 0.3)',
              borderRadius: 'clamp(0.5rem, 2vw, 0.75rem)',
              padding: 'clamp(0.5rem, 2vw, 0.75rem)',
              color: '#fbbf24',
              fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
            }}>{hintMessage}</div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 1rem)', justifyContent: 'center', marginTop: 'clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.75rem, 2.5vw, 0.9rem)' }}>
          <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {stats.correct}
          </span>
          <span style={{ color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
            {stats.incorrect}
          </span>
          <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            {stats.hints}
          </span>
        </div>
      </div>

      {/* Rehabilitation Modal */}
      {showRehabModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(5px)',
          padding: 'clamp(0.5rem, 3vw, 1rem)'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(30, 20, 60, 0.95) 0%, rgba(20, 15, 40, 0.98) 100%)',
            borderRadius: 'clamp(1rem, 3vw, 1.5rem)',
            padding: 'clamp(1.25rem, 4vw, 2rem)',
            maxWidth: '400px',
            width: 'min(90%, 400px)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 0 60px rgba(139, 92, 246, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ marginBottom: 'clamp(0.5rem, 2vw, 1rem)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" style={{ margin: '0 auto', maxWidth: 'clamp(40px, 10vw, 48px)', height: 'auto' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
              </svg>
            </div>
            <h2 style={{ marginBottom: 'clamp(0.75rem, 2vw, 1rem)', fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>Правильно!</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 'clamp(1rem, 3vw, 1.5rem)', fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}>Вы правильно ответили на вопрос из списка ошибок. Что хотите сделать?</p>
            <div style={{ display: 'flex', gap: 'clamp(0.5rem, 2vw, 0.75rem)', flexDirection: 'column' }}>
              <button className="btn" onClick={() => handleRehabChoice(true)} style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', padding: 'clamp(0.75rem, 2vw, 0.875rem) clamp(1rem, 3vw, 1.5rem)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)' }}>
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
                <span>Удалить из ошибок</span>
              </button>
              <button className="btn btn-secondary" onClick={() => handleRehabChoice(false)} style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)', padding: 'clamp(0.75rem, 2vw, 0.875rem) clamp(1rem, 3vw, 1.5rem)' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 'clamp(16px, 4vw, 18px)', height: 'clamp(16px, 4vw, 18px)' }}>
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Оставить для повторения</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <main className="container">
        <div className="card text-center">
          <p>Загрузка...</p>
        </div>
      </main>
    }>
      <QuizContent />
    </Suspense>
  )
}
