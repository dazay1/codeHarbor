import binary from './assets/binary.png'

export const card = 'rounded-[5px] border-2 border-[#4b5362] bg-[#24272d] p-4 shadow-[0_4px_8px_rgba(0,0,0,.38)]'
const B = 'rounded-[7px] border-x-2 border-t-2 border-b-[5px] px-5 py-2.5 text-[18px] font-bold uppercase transition active:translate-y-0.5'
export const PRIMARY = `${B} border-[#69ffff] bg-[#04e5f1] text-[#16191f] hover:brightness-110`
export const GHOST = `${B} border-[#4b5362] bg-[#30353e] text-[#ecebdc] hover:border-[#04e5f1]`
export const OFF = `${B} cursor-not-allowed border-[#4b5362] bg-[#30353e] text-[#a7abae]`

export const Bar = ({ v, max, color = '#e9b655' }) => (
  <div className="h-3 rounded-[4px] border border-[#4b5362] bg-[#16191f] p-0.5">
    <div className="h-full rounded-[3px] transition-all duration-500" style={{ width: `${Math.min(100, (v / max) * 100)}%`, background: color }} />
  </div>
)

export const Avatar = ({ n, me, size = 30 }) =>
  me ? <img src={binary} alt="" style={{ height: size }} /> : (
    <span className="flex items-center justify-center rounded-[4px] font-bold text-[#16191f]"
      style={{ width: size, height: size, background: `hsl(${[...n].reduce((a, c) => a + c.charCodeAt(0), 0) * 47 % 360} 55% 62%)` }}>{n[0]}</span>
  )

export const Title = ({ children, sub }) => (
  <div className="mb-4"><h1 className="text-[34px] font-bold leading-tight">{children}</h1>{sub && <p className="text-[#a7abae]">{sub}</p>}</div>
)
