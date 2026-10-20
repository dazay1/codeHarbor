import { useEffect, useState, useMemo } from 'react'
import ozyImg from '../assets/ozy.png'
import binary from '../assets/binary.png'
import happy from '../assets/binary-happy.png'

// Геометрия карты (в «логических» пикселях, потом масштабируется под экран)
const W = 560, NW = 210, NH = 76, GAP = 136, BANNER = 104, TOP = 24
const XS = [280, 410, 280, 150] // зигзаг по горизонтали

// Линия-«дорожка» между нижним краем карточки a и верхним краем b (скруглённые углы)
const seg = (a, b) => {
  const y1 = a.cy + NH / 2, y2 = b.cy - NH / 2, m = (y1 + y2) / 2, r = 14
  const s = Math.sign(b.cx - a.cx)
  return `M${a.cx} ${y1}V${m - r}Q${a.cx} ${m} ${a.cx + s * r} ${m}H${b.cx - s * r}Q${b.cx} ${m} ${b.cx} ${m + r}V${y2}`
}

const BOX = {
  done: 'bg-[#608b6b] border-[#95d59a] text-[#ecebdc] cursor-pointer',
  cur: 'bg-[#04e5f1] border-[#69ffff] text-[#16191f] cursor-pointer animate-glow',
  lock: 'bg-[#77797a] border-[#b0b0aa] text-[#ecebdc] cursor-not-allowed',
}
const CODE = { done: 'text-[#92dd8c]', cur: 'text-[#16191f]', lock: 'text-[#16191f]' }

const Lock = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16191f" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)

export default function Roadmap({ track, units = [], done, burst, onOpen }) {
  const [k, setK] = useState(1)
  const [shake, setShake] = useState(-1)

  // Calculate layout coordinates whenever 'units' prop changes
  const { items, banners, segs, height } = useMemo(() => {
    const calculatedItems = []
    const calculatedBanners = []
    let y = TOP
    let n = 0

    if (units && units.length > 0) {
      units.forEach((u, ui) => {
        calculatedBanners.push({ u, ui, y, from: n })
        y += BANNER
        if (Array.isArray(u.lessons)) {
          u.lessons.forEach((l) => {
            calculatedItems.push({ ...l, i: n, cx: XS[n % XS.length], cy: y + NH / 2 })
            y += GAP
            n++
          })
        }
      })
    }

    const computedHeight = y + 90
    const computedSegs = calculatedItems.slice(0, -1).map((a, i) => seg(a, calculatedItems[i + 1]))

    return {
      items: calculatedItems,
      banners: calculatedBanners,
      segs: computedSegs,
      height: computedHeight,
    }
  }, [units])

  // Handle screen resizing
  useEffect(() => {
    const f = () => setK(Math.min(1, (window.innerWidth - 16) / W))
    f()
    window.addEventListener('resize', f)
    return () => window.removeEventListener('resize', f)
  }, [])

  if (!items.length) {
    return (
      <div className='flex h-64 items-center justify-center font-bol text-[#04e5f1]'>
        No lessons available for (track?.title || 'this track').
      </div>
    )
  }

  const finished = done >= items.length
  const cur = items[Math.min(done, items.length - 1)]
  const click = (it) => {
    if (it.i > done) { setShake(it.i); setTimeout(() => setShake(-1), 400) } else onOpen(it.i)
  }

  return (
    <div className="mx-auto" style={{ width: W * k, height: height * k }}>
      <div className="relative" style={{ width: W, height: height, transform: `scale(${k})`, transformOrigin: 'top left' }}>
        {/* дорожка: тёмная основа + неоновая линия */}
        <svg className="absolute inset-0 z-0" width={W} height={height} fill="none" strokeLinecap="round">
          {segs.map((d, i) => (
            <g key={i}>
              <path d={d} stroke="#2f3a3e" strokeWidth="6" />
              <path
                d={d} pathLength="1" stroke="#04e5f1" strokeWidth="4" strokeDasharray="1"
                style={{
                  strokeDashoffset: i < done ? 0 : 1, opacity: i < done ? 1 : 0,
                  transition: 'stroke-dashoffset 900ms ease-out, opacity 150ms',
                  filter: 'drop-shadow(0 0 6px #04e5f1)',
                }}
              />
            </g>
          ))}
        </svg>

        {banners.map((b) => {
          const total = b.u.lessons.length ? b.u.lessons.length : 0
          const d = Math.max(0, Math.min(total, done - b.from))
          const tag = b.u.subject_tag || track?.slug?.toUpperCase() || 'UNIT'
          return (
            <div key={b.ui} style={{ top: b.y, height: 80 }}
              className="absolute inset-x-0 z-10 flex items-center justify-between rounded-[5px] border-2 border-[#4b5362] bg-[#24272d] px-4 shadow-[0_4px_8px_rgba(0,0,0,.38)]">
              <div>
                <div className={`text-[14px] font-bold tracking-wider ${{ HTML: 'text-[#92dd8c]', CSS: 'text-[#6edcf0]', JS: 'text-[#e9b655]' }[b.u.track]}`}>
                  {tag} · UNIT {b.ui + 1}
                </div>
                <div className="text-[22px] font-bold leading-tight">{b.u.title}</div>
                <div className="text-[15px] text-[#a7abae]">{b.u.description || b.u.desc}</div>
              </div>
              <div className="text-[22px] text-[#e9b655]">{d}/{total}</div>
            </div>
          )
        })}

        {items.map((it) => {
          const st = it.i < done ? 'done' : it.i === done ? 'cur' : 'lock'
          return (
            <button
              key={it.i} id={`node-${it.i}`} onClick={() => click(it)}
              style={{ left: it.cx - NW / 2, top: it.cy - NH / 2, width: NW, height: NH }}
              className={`absolute z-20 flex items-center justify-center gap-2 rounded-[10px] border-x-[3px] border-t-[3px] border-b-[7px] px-2 leading-tight transition-transform hover:-translate-y-0.5 active:translate-y-0.5 ${BOX[st]} ${shake === it.i ? 'animate-shake' : ''}`}
            >
              {st === 'lock' && <Lock />}
              <span className="flex flex-col items-center">
                <span className={`text-[16px] ${CODE[st]}`}>{it.code || `L${it.i + 1}`}</span>
                <span className={`text-[21px] ${st === 'cur' ? 'font-bold' : ''}`}>{it.title}</span>
              </span>
              {st === 'done' && (
                <span className="animate-pop absolute -right-3 -top-3 flex items-center gap-1 rounded-full border-2 border-[#92dd8c] bg-[#16311f] px-2 py-0.5 text-[15px] text-[#92dd8c]">
                  <img src={ozyImg} alt="" className="h-4" />+{it.ozy || 15} 
                </span>
              )}
            </button>
          )
        })}

        {/* Binary character positioning */}
        {cur && (
          <div className="pointer-events-none absolute z-30 transition-all duration-700 ease-in-out"
            style={{ left: cur.cx - NW / 2 - 4, top: cur.cy - NH / 2 - 84 }}>
            <img src={burst || finished ? happy : binary} alt="Binary" className="animate-bob h-[84px]" />
          </div>
        )}

        {/* Floating loot OZY chips */}
        {burst && items[burst.i] && [0, 1, 2].map((j) => (
          <div key={burst.id + '-' + j} className="animate-loot pointer-events-none absolute z-30 flex items-center gap-1 text-[18px] font-bold text-[#92dd8c]"
            style={{ left: items[burst.i].cx - 26 + (j - 1) * 52, top: items[burst.i].cy - NH / 2 - 10, animationDelay: `${j * 130}ms` }}>
            <img src={ozyImg} alt="" className="h-7" />{j === 1 && `+${items[burst.i].ozy || 15}`}
          </div>
        ))}

        {finished && (
          <div className="absolute inset-x-0 z-10 rounded-[5px] border-2 border-[#92dd8c] bg-[#16311f] p-4 text-center"
            style={{ top: height - 80 }}>
            <div className="text-[24px] font-bold text-[#92dd8c]">🏆 COURSE COMPLETE</div>
            <div className="text-[#a7abae]">Great job! Binary is proud of you!</div>
          </div>
        )}
      </div>
    </div>
  )
}