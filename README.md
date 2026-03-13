# MemeLingo

Interactive web quiz for learning foreign languages using memes.

## Features

- User registration with difficulty levels (Beginner, Intermediate, Advanced)
- Quiz with memes showing missing words
- Error tracking and rehabilitation
- Hints system with penalties
- Statistics and progress tracking
- Constructor for adding new memes
- Progress dashboard
- Session history

## Getting Started

1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `app/` - Next.js app router pages (home, login, profile, quiz, constructor, progress, sessions)
- `components/` - Reusable React components
- `data/` - JSON data files for memes (moved to public/data/)
- `public/` - Static assets and data

## Adding New Memes

Use the constructor page to upload images and add correct words. The system will generate sentences and multiple choice options.