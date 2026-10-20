import { LESSONS } from './lessons'
import { card, PRIMARY, GHOST } from './ui'
import win from './assets/binary-win.png'
import ozyImg from './assets/ozy.png'

export default function CompleteModal({ r, goalDone, streak, onPractice, onClose }) {
  const l = LESSONS[r.i]
  const acc = Math.round(100 / (1 + r.mistakes))
  const time = `${String(Math.floor(r.secs / 60)).padStart(2, '0')}:${String(r.secs % 60).padStart(2, '0')}`
  const stats = [[<img key="o" src={ozyImg} alt="" className="h-6" />, `+${r.reward}`, 'OZY earned'], ['🎯', `${acc}%`, 'Accuracy'], ['⏱', time, 'Time spent']]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className={`${card} w-full max-w-[560px] !border-[#92dd8c] text-center`}>
        <img src={win} alt="" className="animate-bob mx-auto h-[130px]" />
        <h2 className="text-[36px] font-bold text-[#92dd8c]">Lesson complete!{r.mistakes === 0 && ' 💎'}</h2>
        <div className="text-[20px]">{l.code} {l.title}</div>
        <div className="mb-4 text-[#a7abae]">{r.mistakes === 0 ? 'Без единой ошибки! Binary гордится вами.' : 'Вы собрали рабочий код. Binary гордится вами!'}</div>
        <div className="mb-3 grid grid-cols-3 gap-2">
          {stats.map(([i, v, n]) => <div key={n} className="rounded border-2 border-[#4b5362] bg-[#30353e] py-2"><div className="flex h-7 items-center justify-center text-[22px]">{i}</div><div className="text-[26px] font-bold text-[#e9b655]">{v}</div><div className="text-[14px] text-[#a7abae]">{n}</div></div>)}
        </div>
        <div className="mb-4 rounded bg-[#30353e] px-3 py-2 text-[#92dd8c]">
          {goalDone ? '✓ Daily goal completed! ' : ''}Your {streak}-day streak is safe!
        </div>
        <div className="flex gap-3"><button className={`${GHOST} flex-1`} onClick={onPractice}>Practice again</button><button className={`${PRIMARY} flex-1`} onClick={onClose}>Continue</button></div>
      </div>
    </div>
  )
}
