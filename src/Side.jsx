import { achievements, board, liveStreak } from './game'
import { dailyGoals } from './pages/Goals'
import { card, Bar, Avatar } from './ui'
import binary from './assets/binary.png'

export const NAV = [
  ['learn', 'Learn', 'M3 6h6M3 12h18M15 18h6'],
  ['tasks', 'Tasks', 'M16 18l6-6-6-6M8 6l-6 6 6 6'],
  ['shop', 'Shop', 'M4 9l1-5h14l1 5M5 9v11h14V9'],
  ['leaderboard', 'Leaderboard', 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z'],
  ['achievement', 'Achievement', 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8 14l-2 7 6-3 6 3-2-7'],
  ['profile', 'Profile', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM5 21a7 7 0 0 1 14 0'],
  ['goals', 'Goals', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
]
const Ic = ({ d }) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>

export const Nav = ({ screen, go }) => (
  <nav className={`${card} !p-2`}>
    {NAV.map(([id, n, d]) => (
      <button key={id} onClick={() => go(id)}
        className={`mb-0.5 flex h-10 w-full items-center gap-3 rounded border px-2.5 text-[18px] ${screen === id ? 'border-[#04e5f1] bg-[#163b43] font-bold text-[#04e5f1]' : 'border-transparent hover:border-[#4b5362]'}`}>
        <Ic d={d} />{n}
      </button>
    ))}
  </nav>
)

export const BottomNav = ({ screen, go }) => (
  <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-7 border-t-2 border-[#4b5362] bg-[#24272d] lg:hidden">
    {NAV.map(([id, n, d]) => (
      <button key={id} onClick={() => go(id)} aria-label={n} className={`flex flex-col items-center py-2 ${screen === id ? 'text-[#04e5f1]' : 'text-[#a7abae]'}`}><Ic d={d} /><span className="text-[10px]">{n.slice(0, 6)}</span></button>
    ))}
  </nav>
)

export const DailyGoals = ({ s }) => (
  <div className={card}>
    <h3 className="mb-2 text-[20px] font-bold">DAILY GOALS</h3>
    {dailyGoals(s).map((g) => (
      <div key={g.label} className="mb-2 rounded bg-[#30353e] p-2 text-[16px]">
        <div className="flex justify-between"><span><span className="text-[#92dd8c]">{g.v >= g.max ? '✓ ' : ''}</span>{g.label}</span><span className="text-[#92dd8c]">{Math.min(g.v, g.max)}/{g.max}</span></div>
        <div className="mt-1.5"><Bar v={g.v} max={g.max} color="#92dd8c" /></div>
      </div>
    ))}
    <h3 className="mb-2 mt-3 text-[20px] font-bold">ACHIEVEMENTS</h3>
    {achievements(s).sort((a, b) => b.v / b.max - a.v / a.max).slice(0, 3).map((a) => (
      <div key={a.name} className="mb-2 rounded bg-[#30353e] p-2 text-[16px]"><div>{a.icon} {a.name}</div><div className="mt-1.5"><Bar v={a.v} max={a.max} /></div></div>
    ))}
  </div>
)

export const MiniBoard = ({ s, go }) => (
  <button onClick={() => go('leaderboard')} className={`${card} text-left`}>
    <h3 className="mb-2 text-[20px] font-bold">LEADERBOARD</h3>
    {board(s).slice(0, 6).map((r, i) => (
      <div key={r.n} className={`mb-1 flex items-center gap-2 rounded px-2 py-1 text-[16px] ${r.me ? 'bg-[#163b43]' : ''}`}>
        <span className="w-4 text-[#e9b655]">{i + 1}</span><Avatar n={r.n} me={r.me} size={24} /><span className="flex-1 truncate">{r.n}</span><span className="text-[#e9b655]">{r.x}</span>
      </div>
    ))}
  </button>
)

export const ShopPreview = ({ go }) => (
  <div className={card}>
    <h3 className="mb-2 text-[20px] font-bold">SHOP</h3>
    <div className="flex h-[130px] items-center justify-center rounded border-2 border-[#4b5362] bg-[#2a2e35]"><img src={binary} alt="" className="h-24" /></div>
    <div className="my-2 text-[16px]">SHOP PREVIEW</div>
    <button onClick={() => go('shop')} className="w-full rounded border-x-2 border-t-2 border-b-4 border-[#4b5362] bg-[#30353e] py-2 font-bold hover:border-[#04e5f1]">VISIT SHOP</button>
  </div>
)
