import { useEffect, useState } from 'react'

const KEY = 'devlingo-v2'
export const day = (o = 0) => {
  const d = new Date(Date.now() - o * 864e5)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const DEF = { done: 0, ozy: 0, xp: 0, lives: 5, streak: 0, last: '', name: 'You', target: 2, dxp: 0, bought: 0, perfect: 0, claimed: {}, joined: day(), inv: { freeze: 0, hints: 0, pass: 0 }, days: {}, log: [] }
const load = () => {
  try {
    const o = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('devlingo-roadmap-v1'))
    return { ...DEF, ...o, inv: { ...DEF.inv, ...(o && o.inv) } }
  } catch { return DEF }
}
// серия считается живой, если вчера/сегодня были занятия (или есть «заморозка» на пропущенный день)
export const liveStreak = (s) => s.last === day() || s.last === day(1) || (s.last === day(2) && s.inv.freeze > 0) ? s.streak : 0
export const today = (s) => s.days[day()] || { l: 0, o: 0 }

export const SHOP = [
  { id: 'lives', icon: '❤️', name: 'Refill lives', desc: 'Restore all 5 lives and get back to your lesson.', price: 150, group: 'POWER-UPS' },
  { id: 'freeze', icon: '❄️', name: 'Streak freeze', desc: 'Protect your streak if you miss a day.', price: 200, group: 'POWER-UPS' },
  { id: 'dxp', icon: '⚡', name: 'Double OZY', desc: 'Earn twice the OZY for the next 15 minutes.', price: 300, group: 'POWER-UPS' },
  { id: 'hint', icon: '💡', name: 'Extra hint', desc: 'Removes one wrong answer in a quiz.', price: 50, group: 'BINARY EXTRAS' },
  { id: 'pass', icon: '🎟️', name: 'Practice pass', desc: 'Your next mistake will not cost a life.', price: 100, group: 'BINARY EXTRAS' },
]

export const achievements = (s) => {
  const st = liveStreak(s)
  return [
    { icon: '🌱', name: 'First Lesson', desc: 'Complete your first lesson.', v: Math.min(s.done, 1), max: 1 },
    { icon: '🔥', name: '7-Day Streak', desc: 'Practice every day for one week.', v: Math.min(st, 7), max: 7 },
    { icon: '🏆', name: 'HTML Explorer', desc: 'Finish all 9 HTML lessons.', v: Math.min(s.done, 9), max: 9 },
    { icon: '🎨', name: 'CSS Master', desc: 'Finish all 14 CSS lessons.', v: Math.max(0, Math.min(s.done - 9, 14)), max: 14 },
    { icon: '💾', name: 'OZY Collector', desc: 'Earn 1,000 OZY in total.', v: Math.min(s.xp, 1000), max: 1000 },
    { icon: '🛒', name: 'Shopper', desc: 'Buy your first item in the shop.', v: Math.min(s.bought, 1), max: 1 },
    { icon: '⏳', name: '30-Day Streak', desc: 'Keep the flame alive for a month.', v: Math.min(st, 30), max: 30 },
    { icon: '⚙️', name: 'JavaScript Hero', desc: 'Finish all 9 JavaScript lessons.', v: Math.max(0, Math.min(s.done - 23, 9)), max: 9 },
    { icon: '💎', name: 'Perfectionist', desc: 'Complete 5 lessons without a single mistake.', v: Math.min(s.perfect, 5), max: 5 },
  ]
}

const BOTS = [['Anna', 700], ['Alex', 560], ['Maya', 470], ['Leo', 380], ['Max', 300], ['Sophie', 240], ['Daniel', 180], ['Nina', 120], ['Sam', 70]]
export const dow = () => (new Date().getDay() + 6) % 7 // 0 = понедельник
// OZY, заработанные на этой неделе (с понедельника)
export const weekXp = (s) => { let x = 0; for (let i = 0; i <= dow(); i++) x += (s.days[day(i)] || { o: 0 }).o; return x }
// боты «набирают» очки в течение недели детерминированно, чтобы рейтинг каждую неделю обновлялся
const botXp = (n, base) => {
  const seed = [...n + day(dow())].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7) / 997
  return Math.round(base * (0.2 + 0.8 * ((dow() + 1) / 7)) * (0.85 + 0.3 * seed))
}
export const board = (s) =>
  [...BOTS.map(([n, b]) => ({ n, x: botXp(n, b) })), { n: s.name || 'You', x: weekXp(s), me: true }]
    .sort((a, b) => b.x - a.x || (a.me ? 1 : 0) - (b.me ? 1 : 0))
export const trackStats = (s, items = []) => ['HTML', 'CSS', 'JS'].map((tr) => {
  const all = items.map((l, i) => ({ ...l, i })).filter((l) => l.track === tr)
  return { tr, v: all.filter((l) => l.i < s.done).length, max: all.length }
})
export const league = (xp) => (xp >= 900 ? 'Gold' : xp >= 400 ? 'Silver' : 'Bronze')

export function useGame() {
  const [s, setS] = useState(load)
  const [burst, setBurst] = useState(null)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch { /* ignore */ } }, [s])
  useEffect(() => {
    const t = setInterval(() => setS((p) => (p.lives < 5 ? { ...p, lives: p.lives + 1 } : p)), 30000)
    return () => clearInterval(t)
  }, [])

  const log = (p, text, ozy) => [{ t: Date.now(), text, ozy }, ...p.log].slice(0, 20)

  const complete = (i, lessonItem, st = {}) => {
    if (i !== s.done || !lessonItem) return 0
    const t = day()
    const r = (lessonItem.ozy || 10) * (Date.now() < s.dxp ? 2 : 1)
    setS((p) => {
      let streak = p.streak, inv = p.inv
      if (p.last !== t) {
        if (p.last === day(1)) streak++
        else if (p.last === day(2) && inv.freeze > 0) { streak++; inv = { ...inv, freeze: inv.freeze - 1 } }
        else streak = 1
      }
      const d = p.days[t] || { l: 0, o: 0 }
      const lessonCode = (lessonItem.code || '').replace(':', '')
      return { ...p, done: p.done + 1, ozy: p.ozy + r, xp: p.xp + r, streak, inv, last: t, perfect: p.perfect + (st.mistakes === 0 ? 1 : 0),
        days: { ...p.days, [t]: { l: d.l + 1, o: d.o + r } }, log: log(p, `${lessonCode} ${lessonItem.title || ''} completed`, r) 
      }
    })
    const id = Date.now()
    setBurst({ i, id })
    setTimeout(() => setBurst((b) => (b && b.id === id ? null : b)), 2200)
    return r
  }
  
  const miss = () => setS((p) => p.inv.pass > 0 ? { ...p, inv: { ...p.inv, pass: p.inv.pass - 1 } } : { ...p, lives: Math.max(0, p.lives - 1) })
  const useHint = () => setS((p) => ({ ...p, inv: { ...p.inv, hints: p.inv.hints - 1 } }))
  const buy = (id) => {
    const it = SHOP.find((x) => x.id === id)
    if (s.ozy < it.price) return 'Not enough OZY'
    if (id === 'lives' && s.lives >= 5) return 'Lives are already full'
    setS((p) => {
      const n = { ...p, ozy: p.ozy - it.price, bought: p.bought + 1, inv: { ...p.inv }, log: log(p, `Bought ${it.name}`, -it.price) }
      if (id === 'lives') n.lives = 5
      if (id === 'freeze') n.inv.freeze++
      if (id === 'dxp') n.dxp = Date.now() + 9e5
      if (id === 'hint') n.inv.hints++
      if (id === 'pass') n.inv.pass++
      return n
    })
    return `Purchased: ${it.name}`
  }
  const claim = (k) => setS((p) => {
    const t = day(), c = p.claimed[t] || []
    if (c.includes(k)) return p
    return { ...p, ozy: p.ozy + 25, xp: p.xp + 25, claimed: { ...p.claimed, [t]: [...c, k] }, log: log(p, 'Daily goal reward', 25) }
  })
  const restore = (o) => setS({ ...DEF, ...o, inv: { ...DEF.inv, ...o.inv } })
  const set = (patch) => setS((p) => ({ ...p, ...patch }))
  const reset = () => { if (confirm('Сбросить весь прогресс?')) setS({ ...DEF, joined: day() }) }
  return { s, burst, complete, miss, useHint, buy, set, reset, claim, restore }
}
