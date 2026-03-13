'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Meme {
  id: number
  level: string
  image: string
  correctWord: string
  sentence: string
  options: string[]
}

// Available photos from /public/photos/
const availablePhotos = [
  { name: 'bird.jpg', word: 'bird' },
  { name: 'cat.jpg', word: 'cat' },
  { name: 'frog.jpg', word: 'frog' },
  { name: 'pirate.jpg', word: 'pirate' },
]

export default function ConstructorPage() {
  const [memes, setMemes] = useState<Meme[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState('')
  const [correctWord, setCorrectWord] = useState('')
  const [level, setLevel] = useState('beginner')
  const [sentence, setSentence] = useState('')
  const [wrongOptions, setWrongOptions] = useState('')
  const [message, setMessage] = useState('')

  // Load existing memes
  useEffect(() => {
    fetch('/data/memes.json')
      .then((res) => res.json())
      .then(setMemes)
      .catch(() => setMemes([]))
  }, [])

  // Auto-generate sentence when photo is selected
  const handlePhotoSelect = (photo: typeof availablePhotos[0]) => {
    setSelectedPhoto(photo.name)
    setCorrectWord(photo.word)
    // Generate simple sentence
    setSentence(`Посмотри на этот ___! Это потрясающе.`)
  }

  // Add meme to list
  const addMeme = () => {
    if (!selectedPhoto || !correctWord || !sentence || !wrongOptions) {
      setMessage('Пожалуйста, заполните все поля')
      return
    }

    const wrongWords = wrongOptions.split(',').map((w) => w.trim().toLowerCase()).filter(Boolean)
    if (wrongWords.length < 3) {
      setMessage('Пожалуйста, укажите минимум 3 неправильных варианта')
      return
    }

    const newMeme: Meme = {
      id: Date.now(),
      level,
      image: `/photos/${selectedPhoto}`,
      correctWord: correctWord.toLowerCase(),
      sentence,
      options: [correctWord.toLowerCase(), ...wrongWords].sort(() => Math.random() - 0.5),
    }

    const updatedMemes = [...memes, newMeme]
    setMemes(updatedMemes)
    
    // Save to localStorage (for demo - in production this would go to a file/database)
    localStorage.setItem('memes', JSON.stringify(updatedMemes))
    
    // Reset form
    setSelectedPhoto('')
    setCorrectWord('')
    setSentence('')
    setWrongOptions('')
    setMessage('✅ Мем успешно добавлен!')
    
    setTimeout(() => setMessage(''), 3000)
  }

  // Download memes as JSON
  const downloadMemes = () => {
    const data = JSON.stringify(memes, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'memes.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="container">
      <div className="card card-wide">
        <h1>➕ Конструктор мемов</h1>
        <p className="text-center" style={{ marginBottom: '1.5rem' }}>
          Добавьте новые мемы в викторину. Выберите фото, и слово автоматически подставится из названия файла.
        </p>

        {/* Photo Selection */}
        <div className="form-group">
          <label>Выберите фото</label>
          <div className="flex gap-1" style={{ flexWrap: 'wrap' }}>
            {availablePhotos.map((photo) => (
              <button
                key={photo.name}
                className={`option-btn ${selectedPhoto === photo.name ? 'correct' : ''}`}
                onClick={() => handlePhotoSelect(photo)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              >
                <Image 
                  src={`/photos/${photo.name}`} 
                  alt={photo.word}
                  width={80}
                  height={80}
                  style={{ objectFit: 'cover', borderRadius: '0.5rem', marginBottom: '0.25rem' }}
                />
                <span style={{ fontSize: '0.75rem' }}>{photo.word}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Level */}
        <div className="form-group">
          <label>Уровень</label>
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="beginner">🌱 Начальный</option>
            <option value="intermediate">📚 Средний</option>
            <option value="advanced">🎯 Продвинутый</option>
          </select>
        </div>

        {/* Correct Word */}
        <div className="form-group">
          <label>Правильное слово (из названия файла)</label>
          <input
            type="text"
            value={correctWord}
            onChange={(e) => setCorrectWord(e.target.value)}
            placeholder="Авто-заполнено из названия фото"
          />
        </div>

        {/* Sentence */}
        <div className="form-group">
          <label>Предложение (используйте ___ для пропущенного слова)</label>
          <input
            type="text"
            value={sentence}
            onChange={(e) => setSentence(e.target.value)}
            placeholder="Этот ___ очень милый."
          />
        </div>

        {/* Wrong Options */}
        <div className="form-group">
          <label>Неправильные варианты (через запятую, минимум 3 слова)</label>
          <input
            type="text"
            value={wrongOptions}
            onChange={(e) => setWrongOptions(e.target.value)}
            placeholder="собака, рыба, черепаха"
          />
        </div>

        {/* Message */}
        {message && (
          <p className={message.includes('✅') ? 'success-msg text-center' : 'error-msg text-center'}>
            {message}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-1" style={{ justifyContent: 'center', marginTop: '1rem' }}>
          <button className="btn" onClick={addMeme}>Добавить мем</button>
          <button className="btn btn-secondary" onClick={downloadMemes}>Скачать JSON</button>
        </div>

        {/* Preview */}
        {selectedPhoto && (
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f5f3ff', borderRadius: '0.5rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Превью</h3>
            <div className="flex gap-2" style={{ alignItems: 'center' }}>
              <Image 
                src={`/photos/${selectedPhoto}`} 
                alt="Превью"
                width={150}
                height={100}
                style={{ objectFit: 'contain', borderRadius: '0.5rem' }}
              />
              <div>
                <p><strong>Слово:</strong> {correctWord}</p>
                <p><strong>Предложение:</strong> {sentence}</p>
                <p><strong>Варианты:</strong> {correctWord}, {wrongOptions}</p>
              </div>
            </div>
          </div>
        )}

        {/* Existing Memes Count */}
        <p className="text-center text-sm" style={{ marginTop: '1.5rem' }}>
          Всего мемов в базе: <strong>{memes.length}</strong>
        </p>

        {/* Home Link */}
        <div className="text-center" style={{ marginTop: '1rem' }}>
          <a href="/" className="btn btn-outline">🏠 На главную</a>
        </div>
      </div>
    </main>
  )
}
