import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { useGame } from './game'
import { Home } from './pages'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Course from './pages/Course'
import Lesson from './pages/Lesson'

export default function App() {
  const [open, setOpen] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Extract current path without leading slash ('/' -> 'home', '/roadmap' -> 'roadmap')
  const currentPath = location.pathname.slice(1) || 'home'

  // Helper for fast client-side navigation
  const go = (id) => {
    const path = id === 'home' ? '/' : `/${id}`
    navigate(path)
    window.scrollTo(0, 0)
  }

  // Pages that bring their own full layout instead of the app shell
  const standalone = ['home', 'login', 'signup'].includes(currentPath) || currentPath.startsWith('course/')

  return (
    <div className={`min-h-screen font-sans ${standalone ? '' : 'pb-20 lg:pb-0'}`} style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 38px, rgba(96,139,107,.07) 38px 40px)' }}>
      {/* Conditional Layout Routing */}
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home onOpen={setOpen} go={go} />} />
          <Route path="/login" element={<Login go={go} />} />
          <Route path="/signup" element={<Signup go={go} />} />
          <Route path="/course/:courseId" element={<Course />} />
          <Route path="/course/:courseId/:chapterId/:exerciseId" element={<Lesson />} />
        </Routes>
      </main>
    </div>
  )
}
