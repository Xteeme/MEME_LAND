'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface Meme {
  id: number
  level: string
  image: string
  correctWord: string
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

export default function QuizPage() {
  const router = useRouter()
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

  // Load memes based on user level
  useEffect(() => {
    if (user) {
      fetch('/data/memes.json')
        .then((res) => res.json())
        .then((data: Meme[]) => {
          const filtered = data.filter((m) => m.level === user.level)
          setMemes(filtered)
        })
    }
  }, [user])

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
        goToNext()
      }
    } else {
      // Wrong answer
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
      if (activeTab === 'quiz') {
        // Save session stats
        const sessions = JSON.parse(localStorage.getItem('sessions') || '[]')
        sessions.push({ date: new Date().toISOString(), stats, level: user?.level })
        localStorage.setItem('sessions', JSON.stringify(sessions))
        
        // Update total stats
        const total = JSON.parse(localStorage.getItem('totalStats') || '{"correct":0,"incorrect":0,"hints":0,"score":0}')
        total.correct += stats.correct
        total.incorrect += stats.incorrect
        total.hints += stats.hints
        total.score += stats.score
        localStorage.setItem('totalStats', JSON.stringify(total))
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
          <h1>🎉 Сессия завершена!</h1>
          <p style={{ marginBottom: '1rem' }}>Отличная работа, {user.username}!</p>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">{stats.correct}</div>
              <div className="stat-label">Правильно</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.incorrect}</div>
              <div className="stat-label">Неправильно</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{stats.hints}</div>
              <div className="stat-label">Подсказок</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{successPercent}%</div>
              <div className="stat-label">Успешность</div>
            </div>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '1.2rem' }}>
            Итоговый счёт: <strong>{stats.score.toFixed(1)}</strong> / {totalQuestions}
          </p>

          <div className="flex gap-1" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            <button className="btn" onClick={resetSession}>Попробовать снова</button>
            <a href="/profile" className="btn btn-secondary">Профиль</a>
          </div>
        </div>
      </main>
    )
  }

  // Main quiz UI
  return (
    <main className="container">
      <div className="card card-wide">
        {/* Header */}
        <div className="flex flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>👤 {user.username}</span>
          <span>📊 Уровень: {user.level}</span>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => switchTab('quiz')}>
            🎯 Викторина
          </button>
          <button className={`tab ${activeTab === 'errors' ? 'active' : ''}`} onClick={() => switchTab('errors')}>
            ❌ Ошибки ({errors.length})
          </button>
          <button className={`tab ${activeTab === 'repeat' ? 'active' : ''}`} onClick={() => switchTab('repeat')}>
            🔄 Повторение ({repeat.length})
          </button>
        </div>

        {/* Progress */}
        <div className="progress-bar" style={{ marginBottom: '1rem' }}>
          <div className="progress-fill" style={{ width: `${((currentIndex + 1) / currentList.length) * 100}%` }} />
        </div>
        <p className="text-center text-sm" style={{ marginBottom: '1rem' }}>
          Вопрос {currentIndex + 1} из {currentList.length}
        </p>

        {/* Meme Image */}
        <div className="text-center">
          <Image
            src={currentMeme.image}
            alt="Мем"
            width={400}
            height={300}
            className="meme-image"
          />
        </div>

        {/* Sentence */}
        <p className="text-center text-lg" style={{ marginBottom: '1rem', fontWeight: '500' }}>
          {currentMeme.sentence}
        </p>

        {/* Show correct answer if wrong */}
        {showCorrect && (
          <p className="error-msg text-center">
            ❌ Неправильно! Правильный ответ: <strong>{currentMeme.correctWord}</strong>
          </p>
        )}

        {/* Options */}
        <div className="options-grid">
          {currentMeme.options.map((option) => {
            const isSelected = selectedAnswer === option
            const isCorrect = option === currentMeme.correctWord
            let className = 'option-btn'
            if (isSelected && isCorrect) className += ' correct'
            if (isSelected && !isCorrect) className += ' wrong'

            return (
              <button
                key={option}
                className={className}
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            )
          })}
        </div>

        {/* Hint */}
        <div className="text-center" style={{ marginTop: '1rem' }}>
          {!hintUsed ? (
            <button className="btn btn-hint" onClick={useHint}>
              💡 Подсказка (0.5 балла)
            </button>
          ) : (
            <div className="hint-box">{hintMessage}</div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-1 text-sm" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <span>✅ {stats.correct}</span>
          <span>❌ {stats.incorrect}</span>
          <span>💡 {stats.hints}</span>
        </div>
      </div>

      {/* Rehabilitation Modal */}
      {showRehabModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>🎉 Правильно!</h2>
            <p>Вы правильно ответили на вопрос из списка ошибок. Что хотите сделать?</p>
            <div className="modal-actions">
              <button className="btn" onClick={() => handleRehabChoice(true)}>
                Удалить из ошибок
              </button>
              <button className="btn btn-secondary" onClick={() => handleRehabChoice(false)}>
                Оставить для повторения
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
