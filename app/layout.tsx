import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MemeLand - Учите языки через мемы',
  description: 'Интерактивное изучение языков через мемы. Выбирайте правильные слова и развивайте словарный запас весело!',
}

const styles = `
/* MemeLingo - Pure CSS Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
}

body {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 50%, #ddd6fe 100%);
  color: #4c1d95;
  line-height: 1.6;
}

.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  box-shadow: 0 20px 40px rgba(139, 92, 246, 0.15);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  border: 1px solid rgba(167, 139, 250, 0.2);
}

.card-wide {
  max-width: 800px;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #6b21a8;
  margin-bottom: 1rem;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #7c3aed;
  margin-bottom: 0.75rem;
}

p {
  color: #6b21a8;
  margin-bottom: 0.5rem;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(124, 58, 237, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #e9d5ff 0%, #ddd6fe 100%);
  color: #6b21a8;
}

.btn-secondary:hover {
  box-shadow: 0 8px 20px rgba(167, 139, 250, 0.3);
}

.btn-outline {
  background: transparent;
  border: 2px solid #8b5cf6;
  color: #7c3aed;
}

.btn-outline:hover {
  background: #8b5cf6;
  color: white;
}

.btn-hint {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
  color: #78350f;
}

.btn-hint:hover {
  box-shadow: 0 8px 20px rgba(245, 158, 11, 0.4);
}

input, select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #c4b5fd;
  border-radius: 0.5rem;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  background: white;
  color: #4c1d95;
}

input:focus, select:focus {
  outline: none;
  border-color: #8b5cf6;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #6b21a8;
}

.form-group {
  margin-bottom: 1rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  background: #e9d5ff;
  color: #6b21a8;
}

.tab:hover {
  background: #ddd6fe;
}

.tab.active {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin: 1rem 0;
}

.option-btn {
  padding: 0.75rem 1.25rem;
  border: 2px solid #c4b5fd;
  border-radius: 0.5rem;
  background: white;
  color: #6b21a8;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.option-btn:hover {
  border-color: #8b5cf6;
  background: #f5f3ff;
}

.option-btn.correct {
  border-color: #22c55e;
  background: #dcfce7;
  color: #166534;
}

.option-btn.wrong {
  border-color: #ef4444;
  background: #fee2e2;
  color: #991b1b;
}

.meme-image {
  max-width: 100%;
  max-height: 350px;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  object-fit: contain;
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1rem 0;
}

.stat-item {
  background: #f5f3ff;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #7c3aed;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b21a8;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal h2 {
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.hint-box {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #f59e0b;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  color: #78350f;
}

.error-msg {
  color: #dc2626;
  font-weight: 500;
  margin: 0.5rem 0;
}

.success-msg {
  color: #16a34a;
  font-weight: 500;
  margin: 0.5rem 0;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9d5ff;
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
  transition: width 0.3s ease;
}

.list {
  list-style: none;
}

.list-item {
  padding: 0.75rem;
  border-bottom: 1px solid #e9d5ff;
}

.list-item:last-child {
  border-bottom: none;
}

.text-center {
  text-align: center;
}

.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.font-bold {
  font-weight: 700;
}

.mt-1 {
  margin-top: 0.5rem;
}

.mt-2 {
  margin-top: 1rem;
}

.mb-1 {
  margin-bottom: 0.5rem;
}

.mb-2 {
  margin-bottom: 1rem;
}

@media (max-width: 640px) {
  .card {
    padding: 1.5rem;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .tab {
    width: 100%;
    text-align: center;
  }
}
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        <style dangerouslySetInnerHTML={{ __html: styles }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
