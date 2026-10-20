import { useEffect, useState } from 'react'
import Loader from './components/Loader';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { useGame } from './game'
import { Home } from './pages'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Course from './pages/Course'
import Lesson from './pages/Lesson'

export default function App() {
  const [open, setOpen] = useState(null)

  // Dynamic Backend States
  const [user, setUser] = useState(null)
  const [tracks, setTracks] = useState([])
  const [activeTrack, setActiveTrack] = useState(null)

  // Curriculum State fetched from FastAPI
  const [units, setUnits] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

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

  // 1. Fetch Tracks & User Profile on initial mount
  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetch('http://127.0.0.1:8000/api/tracks').then((res) => res.json()),
      fetch('http://127.0.0.1:8000/api/users/1').then((res) => res.json()).catch(() => null),
    ])
      .then(([tracksData, userData]) => {
        setTracks(tracksData)
        if (userData) setUser(userData)

        // Set active track based on user preference saved in DB, or fallback to the first track
        const userPrefTrack = tracksData.find(
          (t) => t.slug === userData?.selectedTrackSlug
        )
        setActiveTrack(userPrefTrack || tracksData[0] || null)
      })
      .catch((err) => {
        console.error('Error fetching tracks or user profile:', err)
      })
      .finally(() => setLoading(false))
  }, [])

  // 2. Fetch Curriculum Nodes whenever activeTrack changes
  useEffect(() => {
    if (!activeTrack) return
    setLoading(true)
    fetch(`http://127.0.0.1:8000/api/nodes/${activeTrack.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('API network response error')
        return res.json()
      })
      .then((data) => {
        setUnits(data)
        const flat = data.flatMap((u) =>
          (u.lessons || []).map((l) => ({ ...l, track: u.subjectTag || activeTrack.slug }))
        )
        setItems(flat)
      })
      .catch((err) => {
        console.error('Error fetching curriculum:', err)
        setUnits([])
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [activeTrack])

  console.log(items, units)
  // Pages that bring their own full layout instead of the app shell
  const standalone = ['home', 'login', 'signup'].includes(currentPath) || currentPath.startsWith('course/')

  if (loading) {
    return (
      <Loader text="Getting your lessons ready" />
    )
  }

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
