import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MemeLand - Учите языки через мемы',
  description: 'Интерактивное изучение языков через мемы. Выбирайте правильные слова и развивайте словарный запас весело!',
}

const styles = `
/* MemeLand - Modern Gaming Theme */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  --primary: #8b5cf6;
  --primary-glow: rgba(139, 92, 246, 0.4);
  --secondary: #06b6d4;
  --secondary-glow: rgba(6, 182, 212, 0.4);
  --danger: #f43f5e;
  --danger-glow: rgba(244, 63, 94, 0.4);
  --success: #10b981;
  --success-glow: rgba(16, 185, 129, 0.4);
  --warning: #f59e0b;
  --warning-glow: rgba(245, 158, 11, 0.4);
  --bg-dark: #0f0a1e;
  --bg-card: rgba(30, 20, 60, 0.7);
  --bg-glass: rgba(255, 255, 255, 0.05);
  --text-primary: #ffffff;
  --text-secondary: #a5b4fc;
  --border-glow: rgba(139, 92, 246, 0.3);
}

html {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
}

body {
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at 0% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 100% 100%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #0a0612 0%, #0f0a1e 50%, #0a0612 100%);
  background-attachment: fixed;
  color: #ffffff;
  line-height: 1.6;
  overflow-x: hidden; /* Prevent horizontal scroll */
  width: 100%;
  max-width: 100vw;
  position: relative;
}

.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}

.card {
  background: linear-gradient(135deg, rgba(30, 20, 60, 0.8) 0%, rgba(20, 15, 40, 0.9) 100%);
  border-radius: 1.5rem;
  box-shadow: 
    0 0 40px rgba(139, 92, 246, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  border: 1px solid rgba(139, 92, 246, 0.3);
  backdrop-filter: blur(20px);
  position: relative;
  box-sizing: border-box;
  margin-left: auto;
  margin-right: auto;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
}

.card-wide {
  max-width: 900px;
  width: 100%;
}

h1 {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
  text-align: center;
}

h2 {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
}

h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #a5b4fc;
  margin-bottom: 0.5rem;
}

p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

/* Modern Gaming Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%);
  color: white;
  border: 1px solid rgba(139, 92, 246, 0.5);
  border-radius: 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  box-shadow: 
    0 0 20px rgba(139, 92, 246, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover::before {
  left: 100%;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.5),
    0 6px 20px rgba(0, 0, 0, 0.4);
}

.btn:active {
  transform: translateY(0);
}

.btn-secondary {
  background: linear-gradient(135deg, rgba(167, 139, 250, 0.9) 0%, rgba(139, 92, 246, 0.9) 100%);
  border-color: rgba(167, 139, 250, 0.5);
  box-shadow: 
    0 0 20px rgba(167, 139, 250, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-secondary:hover {
  box-shadow: 
    0 0 30px rgba(167, 139, 250, 0.5),
    0 6px 20px rgba(0, 0, 0, 0.4);
}

.btn-outline {
  background: rgba(30, 20, 60, 0.5);
  color: #a5b4fc;
  border: 1px solid rgba(139, 92, 246, 0.4);
  box-shadow: 
    0 0 15px rgba(139, 92, 246, 0.2),
    0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-outline:hover {
  background: rgba(139, 92, 246, 0.2);
  color: white;
  box-shadow: 
    0 0 25px rgba(139, 92, 246, 0.4),
    0 6px 20px rgba(0, 0, 0, 0.4);
}

.btn-outline:active {
  transform: translateY(0);
}

.btn-hint {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%);
  color: white;
  border-color: rgba(245, 158, 11, 0.5);
  box-shadow: 
    0 0 20px rgba(245, 158, 11, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.3);
}

.btn-hint:hover {
  box-shadow: 
    0 0 30px rgba(245, 158, 11, 0.5),
    0 6px 20px rgba(0, 0, 0, 0.4);
}

input, select {
  width: 100%;
  padding: 1rem 1.25rem;
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(10, 6, 18, 0.6);
  color: white;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

input:focus, select:focus {
  outline: none;
  border-color: rgba(139, 92, 246, 0.6);
  background: rgba(10, 6, 18, 0.8);
  box-shadow: 
    0 0 20px rgba(139, 92, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #a5b4fc;
  font-size: 0.9rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.tab {
  padding: 0.75rem 1.25rem;
  border-radius: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.3);
  background: rgba(30, 20, 60, 0.5);
  color: #a5b4fc;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.tab:hover {
  background: rgba(139, 92, 246, 0.2);
  color: white;
}

.tab:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #202f36;
}

.tab.active {
  background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  box-shadow: 0 4px 0 #5b21b6;
}

.tab.active:active {
  box-shadow: 0 2px 0 #5b21b6;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
  margin: 1.5rem 0;
}

.option-btn {
  padding: 1rem 1.5rem;
  border: 3px solid #202f36;
  border-radius: 1rem;
  background: #37464f;
  color: #e0e0e0;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.1s ease;
  box-shadow: 0 4px 0 #131f24;
  position: relative;
  top: 0;
}

.option-btn:hover {
  border-color: #8b5cf6;
  background: #45565e;
  transform: translateY(-2px);
  box-shadow: 0 6px 0 #8b5cf6;
}

.option-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 0 #8b5cf6;
}

.option-btn.correct {
  border-color: #8b5cf6;
  background: #2d1a4a;
  box-shadow: 0 4px 0 #8b5cf6;
  color: #a78bfa;
}

.option-btn.correct:hover {
  box-shadow: 0 6px 0 #8b5cf6;
}

.option-btn.wrong {
  border-color: #ff4b4b;
  background: #3a1a1a;
  box-shadow: 0 4px 0 #d63939;
  color: #ff6b6b;
}

.meme-image {
  max-width: 100%;
  max-height: 350px;
  border-radius: 1rem;
  box-shadow: 0 8px 0 rgba(0, 0, 0, 0.3);
  object-fit: contain;
  margin-bottom: 1.5rem;
  border: 3px solid #202f36;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1.5rem 0;
}

.stat-item {
  background: #37464f;
  padding: 1.25rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 6px 0 #202f36;
  border: 3px solid #202f36;
}

.stat-value {
  font-size: 2rem;
  font-weight: 800;
  color: #8b5cf6;
}

.stat-label {
  font-size: 0.875rem;
  color: #8899a6;
  font-weight: 600;
  text-transform: uppercase;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(19, 31, 36, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #37464f;
  border-radius: 1.5rem;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 0 #202f36, 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 3px solid #202f36;
}

.modal h2 {
  margin-bottom: 1rem;
  color: #8b5cf6;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.hint-box {
  background: linear-gradient(180deg, #3d3a1a 0%, #2a2810 100%);
  border: 3px solid #f59e0b;
  border-radius: 1rem;
  padding: 1rem 1.25rem;
  margin: 1rem 0;
  color: #fbbf24;
  box-shadow: 0 4px 0 #b45309;
  font-weight: 600;
}

.error-msg {
  color: #ff4b4b;
  font-weight: 700;
  margin: 0.5rem 0;
  text-align: center;
}

.success-msg {
  color: #8b5cf6;
  font-weight: 700;
  margin: 0.5rem 0;
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 16px;
  background: #202f36;
  border-radius: 1rem;
  overflow: hidden;
  margin: 1rem 0;
  border: 2px solid #131f24;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(180deg, #8b5cf6 0%, #7c3aed 100%);
  transition: width 0.3s ease;
  box-shadow: 0 2px 0 #5b21b6;
}

.list {
  list-style: none;
}

.list-item {
  padding: 1rem;
  border-bottom: 2px solid #202f36;
  background: #37464f;
  border-radius: 0.75rem;
  margin-bottom: 0.5rem;
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

/* Modern Level Map Styles */
.level-map {
  position: relative;
  width: 100%;
  height: 500px;
  background: 
    radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
    linear-gradient(180deg, rgba(20, 15, 40, 0.8) 0%, rgba(10, 6, 18, 0.9) 100%);
  border-radius: 1.5rem;
  border: 1px solid rgba(139, 92, 246, 0.2);
  box-shadow: 
    0 0 40px rgba(139, 92, 246, 0.1),
    inset 0 0 60px rgba(0,0,0,0.3);
  overflow: hidden;
}

.level-btn {
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 
    0 0 20px rgba(0,0,0,0.3),
    inset 0 1px 0 rgba(255,255,255,0.1);
  backdrop-filter: blur(10px);
}

.level-btn.unlocked {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%);
  color: white;
  box-shadow: 
    0 0 25px rgba(139, 92, 246, 0.5),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

.level-btn.unlocked:hover {
  transform: translateY(-3px) scale(1.1);
  box-shadow: 
    0 0 35px rgba(139, 92, 246, 0.7),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.level-btn.unlocked:active {
  transform: translateY(-1px) scale(1.05);
}

.level-btn.locked {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.3);
  cursor: not-allowed;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.level-btn.completed {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%);
  color: white;
  cursor: pointer;
  box-shadow: 
    0 0 25px rgba(16, 185, 129, 0.5),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

.level-btn.completed:hover {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 0 35px rgba(16, 185, 129, 0.6),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.level-btn.boss {
  width: 75px;
  height: 75px;
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.9) 0%, rgba(217, 119, 6, 0.9) 100%);
  color: white;
  box-shadow: 
    0 0 30px rgba(245, 158, 11, 0.5),
    inset 0 1px 0 rgba(255,255,255,0.2);
}

.level-btn.boss:hover {
  box-shadow: 
    0 0 45px rgba(245, 158, 11, 0.7),
    inset 0 1px 0 rgba(255,255,255,0.3);
}

.level-path {
  position: absolute;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 4;
  fill: none;
  stroke-linecap: round;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.level-path.completed {
  stroke: rgba(139, 92, 246, 0.6);
  filter: drop-shadow(0 0 8px rgba(139, 92, 246, 0.5));
}

@media (max-width: 640px) {
  .container {
    padding: 0.5rem;
  }
  
  .card {
    padding: 1rem;
    border-radius: 1rem;
  }
  
  .card-wide {
    max-width: 100%;
  }
  
  h1 {
    font-size: 1.5rem;
  }
  
  h2 {
    font-size: 1.25rem;
  }
  
  .tabs {
    flex-direction: row;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }
  
  .tab {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 0.5rem;
  }
  
  .btn {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    border-radius: 0.5rem;
  }
  
  .glow-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    border-radius: 0.5rem;
  }
}

/* Mobile Quiz Optimizations */
@media (max-width: 480px) {
  * {
    box-sizing: border-box;
  }
  
  html, body {
    overflow-x: hidden !important;
    width: 100% !important;
    max-width: 100vw !important;
  }
  
  .container {
    padding: 0.25rem;
    align-items: flex-start;
    padding-top: 0.5rem;
    width: 100% !important;
    max-width: 100vw !important;
  }
  
  .card {
    padding: 0.75rem;
    border-radius: 0.75rem;
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
  }
  
  .card-wide {
    max-width: 100% !important;
    width: 100% !important;
  }
  
  /* Reduce logo size on mobile */
  .card img[src*="logo.png"] {
    width: 60px !important;
    height: 40px !important;
    max-width: 100% !important;
  }
  
  /* Ensure all images don't overflow */
  img {
    max-width: 100% !important;
    height: auto !important;
  }
  
  /* Compact header elements */
  .card > div:first-child {
    margin-bottom: 0.5rem !important;
  }
  
  /* Reduce spacing throughout */
  .card > div:nth-child(2) {
    margin-bottom: 0.75rem !important;
    gap: 0.5rem !important;
  }
  
  /* Compact stats counter */
  .card > div:nth-child(3) {
    margin-bottom: 0.75rem !important;
    gap: 0.5rem !important;
    font-size: 0.75rem !important;
  }
  
  .card > div:nth-child(3) svg {
    width: 14px !important;
    height: 14px !important;
  }
  
  /* Thinner progress bar */
  .card > div:nth-child(4) {
    height: 6px !important;
    margin-bottom: 0.5rem !important;
  }
  
  .card > div:nth-child(4) + p {
    font-size: 0.7rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  /* Smaller meme image on mobile */
  .card .meme-image,
  .card img[alt="Мем"] {
    max-height: 200px !important;
    border-radius: 0.5rem !important;
    margin-bottom: 0.75rem !important;
    width: 100% !important;
    object-fit: contain !important;
  }
  
  /* Compact sentence and translation */
  .card > p {
    font-size: 1rem !important;
    margin-bottom: 0.5rem !important;
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
  }
  
  .card > p + p {
    font-size: 0.8rem !important;
    margin-bottom: 0.75rem !important;
  }
  
  /* Responsive answer options - single column on very small screens */
  .card > div[style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
    gap: 0.5rem !important;
    margin-bottom: 0.75rem !important;
    width: 100% !important;
  }
  
  .card > div[style*="grid-template-columns"] button {
    padding: 0.75rem 1rem !important;
    font-size: 0.9rem !important;
    min-height: 50px !important;
    width: 100% !important;
    word-wrap: break-word !important;
  }
  
  /* Compact hint */
  .card > div.text-center {
    margin-top: 0.75rem !important;
  }
  
  .card > div.text-center button {
    font-size: 0.75rem !important;
    padding: 0.5rem 0.75rem !important;
    max-width: 100% !important;
  }
  
  .card > div.text-center + div {
    margin-top: 0.75rem !important;
  }
  
  /* Hide duplicate stats on mobile */
  .card > div[style*="margin-top: 1.5rem"],
  .card > div[style*="margin-top: 1rem"] {
    display: none !important;
  }
  
  /* Compact modal on mobile */
  .modal {
    padding: 1.25rem !important;
    width: 95% !important;
    max-width: 95% !important;
  }
  
  .modal h2 {
    font-size: 1.25rem !important;
  }
  
  .modal p {
    font-size: 0.85rem !important;
  }
  
  .modal-actions,
  .card > div[style*="flex-direction: column"] {
    gap: 0.5rem !important;
  }
  
  .modal-actions button,
  .card > div[style*="flex-direction: column"] button {
    font-size: 0.85rem !important;
    padding: 0.75rem 1rem !important;
    width: 100% !important;
  }
  
  /* Session complete screen optimizations */
  .card > div[style*="margin-bottom: 1rem"] svg:first-child,
  .card > div[style*="margin-bottom: 1.5rem"] svg:first-child {
    width: 48px !important;
    height: 48px !important;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 0.5rem !important;
    margin-bottom: 1rem !important;
  }
  
  .stats-grid > div {
    padding: 0.75rem !important;
    border-radius: 0.5rem !important;
    min-width: 0 !important;
  }
  
  .stats-grid > div > div:first-child {
    font-size: 1.25rem !important;
  }
  
  .stats-grid > div > div:last-child {
    font-size: 0.65rem !important;
  }
  
  /* Improve button touch targets on mobile */
  .btn, .glow-btn {
    min-height: 44px !important;
    max-width: 100% !important;
  }
  
  /* Optimize tabs for mobile - horizontal scroll if needed */
  .tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    justify-content: flex-start !important;
    width: 100% !important;
  }
  
  .tab {
    white-space: nowrap;
    flex-shrink: 0;
  }
  
  /* Fix flex containers */
  .flex,
  [style*="display: flex"] {
    flex-wrap: wrap !important;
    max-width: 100% !important;
  }
  
  /* Fix all text elements */
  h1, h2, h3, h4, h5, h6 {
    word-wrap: break-word !important;
    overflow-wrap: break-word !important;
    max-width: 100% !important;
  }
}

/* Modern Gaming Button Styles */
.glow-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: white;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%);
  border: 1px solid rgba(139, 92, 246, 0.3);
  border-radius: 0.75rem;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 20px rgba(139, 92, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

.glow-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s ease;
}

.glow-btn:hover::before {
  left: 100%;
}

.glow-btn:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 0 30px rgba(139, 92, 246, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(139, 92, 246, 0.6);
}

.glow-btn:active {
  transform: translateY(0);
}

/* Color variants */
.glow-btn-red {
  background: linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(244, 63, 94, 0.1) 100%);
  border-color: rgba(244, 63, 94, 0.3);
  box-shadow: 
    0 0 20px rgba(244, 63, 94, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glow-btn-red:hover {
  box-shadow: 
    0 0 30px rgba(244, 63, 94, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(244, 63, 94, 0.6);
}

.glow-btn-green {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%);
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 
    0 0 20px rgba(16, 185, 129, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glow-btn-green:hover {
  box-shadow: 
    0 0 30px rgba(16, 185, 129, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(16, 185, 129, 0.6);
}

.glow-btn-orange {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%);
  border-color: rgba(245, 158, 11, 0.3);
  box-shadow: 
    0 0 20px rgba(245, 158, 11, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glow-btn-orange:hover {
  box-shadow: 
    0 0 30px rgba(245, 158, 11, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(245, 158, 11, 0.6);
}

.glow-btn-white {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 0 20px rgba(255, 255, 255, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.glow-btn-white:hover {
  box-shadow: 
    0 0 30px rgba(255, 255, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Icon inside button */
.glow-btn svg {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  transition: transform 0.3s ease;
}

.glow-btn:hover svg {
  transform: scale(1.1);
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
