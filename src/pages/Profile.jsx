import { useState } from 'react'
import { achievements, league, liveStreak, trackStats } from '../game'
import { card, Bar, GHOST, Title } from '../ui'
import binary from '../assets/binary.png'

export default function Profile({ s, set, restore }) {
  const [edit, setEdit] = useState(false)
  const [paste, setPaste] = useState('')
  const [msg, setMsg] = useState('')
  const code = btoa(unescape(encodeURIComponent(JSON.stringify(s))))
  const doRestore = () => {
    try { const o = JSON.parse(decodeURIComponent(escape(atob(paste.trim())))); if (typeof o.done !== 'number') throw new Error(); restore(o); setMsg('Progress restored!') } catch { setMsg('Неверный код') }
  }
  const got = achievements(s).filter((a) => a.v >= a.max).length
  const stats = [['🔥', liveStreak(s), 'Day streak'], ['⚡', s.xp.toLocaleString('en-US'), 'Total XP'], ['💾', s.ozy.toLocaleString('en-US'), 'OZY balance'], ['🏅', got, 'Achievements']]
  return (
    <div>
      <Title sub="Your coding journey, all in one place.">Profile</Title>
      <div className={`${card} mb-4 flex flex-wrap items-center gap-5`}>
        <img src={binary} alt="" className="h-[96px]" />
        <div className="flex-1">
          {edit ? <input autoFocus maxLength={16} value={s.name} onChange={(e) => set({ name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && setEdit(false)}
            className="w-full rounded border-2 border-[#04e5f1] bg-[#16191f] px-2 py-1 text-[28px] font-bold outline-none" />
            : <div className="text-[32px] font-bold">{s.name || 'You'}</div>}
          <div className="text-[#a7abae]">Joined {s.joined}</div>
          <div className="text-[#e9b655]">🏆 {league(s.xp)} League</div>
        </div>
        <button className={`${GHOST} !py-1.5 !text-[16px]`} onClick={() => setEdit(!edit)}>{edit ? 'Save' : 'Edit profile'}</button>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([i, v, l]) => <div key={l} className={card}><div className="text-[26px]">{i}</div><div className="text-[28px] font-bold">{v}</div><div className="text-[#a7abae]">{l}</div></div>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className={card}>
          <h3 className="mb-3 text-[22px] font-bold">COURSE PROGRESS</h3>
          {trackStats(s).map(({ tr, v, max }) => (
            <div key={tr} className="mb-3"><div className="mb-1 flex justify-between"><b>{tr === 'JS' ? 'JavaScript' : tr}</b><span className="text-[#a7abae]">{v}/{max} lessons</span></div>
              <Bar v={v} max={max} color={{ HTML: '#92dd8c', CSS: '#6edcf0', JS: '#e9b655' }[tr]} /></div>
          ))}
        </div>
        <div className={card}>
          <h3 className="mb-3 text-[22px] font-bold">RECENT ACTIVITY</h3>
          {s.log.length === 0 && <div className="text-[#a7abae]">Пока пусто. Пройдите первый урок!</div>}
          {s.log.slice(0, 5).map((a) => (
            <div key={a.t} className="mb-2 rounded bg-[#30353e] px-3 py-2"><div>{a.text}</div>
              <div className="text-[14px] text-[#a7abae]">{new Date(a.t).toLocaleDateString()} {a.ozy ? <span className={a.ozy > 0 ? 'text-[#92dd8c]' : 'text-[#e87879]'}>{a.ozy > 0 ? '+' : ''}{a.ozy} OZY</span> : null}</div></div>
          ))}
        </div>
      </div>
      <div className={`${card} mt-4`}>
        <h3 className="mb-1 text-[22px] font-bold">SAVE &amp; RESTORE</h3>
        <p className="mb-2 text-[#a7abae]">Прогресс хранится в этом браузере. Скопируйте код, чтобы перенести его на другое устройство.</p>
        <textarea readOnly value={code} onFocus={(e) => e.target.select()} className="mb-2 h-16 w-full rounded border border-[#4b5362] bg-[#16191f] p-2 font-mono text-[12px] outline-none" />
        <div className="flex gap-2">
          <input value={paste} onChange={(e) => { setPaste(e.target.value); setMsg('') }} placeholder="Вставьте код для восстановления"
            className="min-w-0 flex-1 rounded border border-[#4b5362] bg-[#16191f] px-2 outline-none focus:border-[#04e5f1]" />
          <button className={`${GHOST} !py-1.5 !text-[16px]`} onClick={doRestore}>Restore</button>
        </div>
        <div className="mt-2 text-[#e9b655]">{msg}</div>
      </div>
    </div>
  )
}
