import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="container">
      <div className="card text-center">
        <div style={{ marginBottom: '1.5rem' }}>
          <Image 
            src="/logo.png" 
            alt="MemeLand Logo" 
            width={300} 
            height={200}
            style={{ maxWidth: '100%', height: 'auto' }}
            priority
          />
        </div>
        <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
          Учите языки через мемы! Выбирайте правильное пропущенное слово и расширяйте свой словарный запас.
        </p>
        
        <div className="flex flex-wrap gap-2" style={{ justifyContent: 'center' }}>
          <Link href="/login" className="btn">
            🚀 Начать обучение
          </Link>
          <Link href="/constructor" className="btn btn-secondary">
            ➕ Добавить мем
          </Link>
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f3ff', borderRadius: '0.5rem' }}>
          <h3 style={{ marginBottom: '0.5rem', color: '#7c3aed' }}>Как это работает:</h3>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>1. Создайте профиль и выберите уровень</p>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>2. Увидьте мем с пропущенным словом</p>
          <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>3. Выберите правильное слово из вариантов</p>
          <p style={{ fontSize: '0.9rem' }}>4. Отслеживайте прогресс и повторяйте ошибки</p>
        </div>
      </div>
    </main>
  )
}
