'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface DictionaryEntry {
  id: number
  word: string
  translation: string
  image: string
  learnedAt: string
}

interface User {
  username: string
  password: string
  level: string
  isAdmin?: boolean
  createdAt: string
}

export default function DictionaryPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [dictionary, setDictionary] = useState<DictionaryEntry[]>([])

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

    const dictData = localStorage.getItem(`dictionary_${parsedUser.username}`)
    if (dictData) {
      setDictionary(JSON.parse(dictData))
    }
  }, [router])

  if (!user) {
    return (
      <main className="container">
        <div className="card text-center">
          <p>Загрузка...</p>
        </div>
      </main>
    )
  }

  if (dictionary.length === 0) {
    return (
      <main className="container">
        <div className="card text-center">
          <div style={{ marginBottom: '1rem' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="1.5" style={{ margin: '0 auto' }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <h1>Мой словарь</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>
            Пока пусто! Проходите викторину, чтобы добавлять слова.
          </p>
          <Link href="/map" className="btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"></polygon>
            </svg>
            <span>На карту</span>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container">
      <div className="card card-wide">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <h1 style={{ margin: 0 }}>Мой словарь</h1>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>{user.username}</span>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            <Link href="/map" className="glow-btn" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 21 18 21 2 16 6 8 2 1 6"></polygon>
              </svg>
              <span>Карта</span>
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

        {/* Stats */}
        <div style={{ 
          background: 'rgba(139, 92, 246, 0.1)', 
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '0.75rem',
          padding: '1rem 2rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>Изучено слов</span>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#8b5cf6' }}>{dictionary.length}</div>
        </div>

        {/* Dictionary Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1.5rem',
          padding: '1rem'
        }}>
          {dictionary.map((entry) => (
            <div key={entry.id} style={{
              background: 'linear-gradient(135deg, rgba(30, 20, 60, 0.8) 0%, rgba(20, 15, 40, 0.9) 100%)',
              borderRadius: '1rem',
              overflow: 'hidden',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              boxShadow: '0 0 20px rgba(139, 92, 246, 0.1), 0 4px 15px rgba(0, 0, 0, 0.3)',
              transition: 'all 0.3s ease'
            }}>
              {/* Image */}
              <div style={{ position: 'relative', height: '150px', overflow: 'hidden' }}>
                <Image
                  src={entry.image}
                  alt={entry.word}
                  fill
                  style={{ objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.9)',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1rem', textAlign: 'center' }}>
                <h3 style={{ 
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontSize: '1.25rem', 
                  fontWeight: '800',
                  marginBottom: '0.25rem'
                }}>
                  {entry.word}
                </h3>
                <p style={{ 
                  color: '#a5b4fc', 
                  fontSize: '1rem',
                  fontWeight: '600'
                }}>
                  {entry.translation}
                </p>
                <p style={{ 
                  color: 'rgba(255,255,255,0.4)', 
                  fontSize: '0.75rem',
                  marginTop: '0.5rem'
                }}>
                  {new Date(entry.learnedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
