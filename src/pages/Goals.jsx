import { useState } from 'react'
import { day, liveStreak, today } from '../game'
import { card, Bar, PRIMARY, Title } from '../ui'
import binary from '../assets/binary.png'
import flame from '../assets/flame.png'

export const TARGETS = [['Casual', 1], ['Regular', 2], ['Serious', 3], ['Intense', 4]]
export const dailyGoals = (s) => {
  const t = today(s)
  return [
    { label: `Complete ${s.target} lesson${s.target > 1 ? 's' : ''}`, v: t.l, max: s.target },
    { label: 'Earn 100 OZY', v: t.o, max: 100 },
    { label: 'Keep your streak alive', v: s.last === day() ? 1 : 0, max: 1 },
  ]
}

export default function Goals({ s, set, go, claim }) {
  const got = s.claimed[day()] || []
  const [pick, setPick] = useState(s.target), [saved, setSaved] = useState(false)
  const st = liveStreak(s), dow = (new Date().getDay() + 6) % 7
  const week = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((n, i) => ({ n, on: !!s.days[day(dow - i)], now: i === dow }))
  return (
    <div>
      <Title sub="A little coding every day adds up. Keep your streak going.">Goals</Title>
      <div className={`${card} mb-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3"><img src={flame} alt="" className="h-14" />
            <div><div className="text-[28px] font-bold text-[#e9b655]">{st}-day streak</div><div className="text-[#a7abae]">{st ? "You've shown up. Let's keep it going!" : 'Finish a lesson today to start a streak.'}</div></div></div>
          <img src={binary} alt="" className="hidden h-16 sm:block" />
        </div>
        <div className="mt-3 grid grid-cols-7 gap-2">
          {week.map((d) => (
            <div key={d.n} className={`rounded border-2 py-2 text-center ${d.now ? 'border-[#e9b655]' : 'border-[#4b5362]'} bg-[#30353e]`}>
              <div className="text-[13px] text-[#a7abae]">{d.n}</div><div>{d.on ? '🔥' : '○'}</div></div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={card}>
          <h3 className="mb-3 text-[22px] font-bold">DAILY GOALS</h3>
          {dailyGoals(s).map((g, k) => (
            <div key={g.label} className="mb-2 rounded bg-[#30353e] p-3">
              <div className="flex justify-between"><span><span className="text-[#92dd8c]">{g.v >= g.max ? '✓ ' : ''}</span>{g.label}</span><span className="text-[#92dd8c]">{Math.min(g.v, g.max)}/{g.max}</span></div>
              <div className="mt-2"><Bar v={g.v} max={g.max} color="#92dd8c" /></div>
              {g.v >= g.max && (got.includes(k)
                ? <div className="mt-2 text-[14px] text-[#a7abae]">Reward claimed ✓</div>
                : <button onClick={() => claim(k)} className="mt-2 rounded border-b-4 border-[#e9b655] bg-[#4a3a1a] px-3 py-1 text-[15px] font-bold text-[#e9b655] hover:brightness-125">🎁 Claim +25 OZY</button>)}
            </div>
          ))}
          <button className={`${PRIMARY} mt-2 w-full`} onClick={() => go('learn')}>Continue learning</button>
        </div>
        <div className={card}>
          <h3 className="mb-1 text-[22px] font-bold">DAILY PRACTICE TARGET</h3>
          <p className="mb-3 text-[#a7abae]">Choose a pace you can stick with.</p>
          {TARGETS.map(([n, v]) => (
            <button key={n} onClick={() => { setPick(v); setSaved(false) }}
              className={`mb-2 flex w-full items-center gap-3 rounded border-2 px-3 py-2 text-left ${pick === v ? 'border-[#04e5f1] bg-[#163b43]' : 'border-[#4b5362] bg-[#30353e]'}`}>
              <span className={`h-4 w-4 rounded-full border-2 ${pick === v ? 'border-[#04e5f1] bg-[#04e5f1]' : 'border-[#a7abae]'}`} />
              <span><b>{n}</b><span className="block text-[14px] text-[#a7abae]">{v} lesson{v > 1 ? 's' : ''} / day</span></span>
            </button>
          ))}
          <button className={`${PRIMARY} w-full`} onClick={() => { set({ target: pick }); setSaved(true) }}>Save goal</button>
          <div className="mt-2 text-center text-[#92dd8c]">{saved ? 'Saved!' : ''}</div>
        </div>
      </div>
    </div>
  )
}
