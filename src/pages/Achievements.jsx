import { achievements } from '../game'
import { card, Bar, Title } from '../ui'

const Item = ({ a }) => {
  const ok = a.v >= a.max
  return (
    <div className={`${card} ${ok ? '!border-[#92dd8c]' : ''}`}>
      <div className="mb-2 flex h-14 items-center justify-center rounded bg-[#30353e] text-[34px]">{a.icon}</div>
      <div className="text-[20px] font-bold">{a.name}</div>
      <div className="mb-2 text-[15px] text-[#a7abae]">{a.desc}</div>
      <Bar v={a.v} max={a.max} color={ok ? '#92dd8c' : '#e9b655'} />
      <div className={`mt-1 text-[14px] ${ok ? 'text-[#92dd8c]' : 'text-[#a7abae]'}`}>{ok ? '✓ Unlocked' : `${a.v}/${a.max}`}</div>
    </div>
  )
}

export default function Achievements({ s }) {
  const all = achievements(s), got = all.filter((a) => a.v >= a.max), next = all.filter((a) => a.v < a.max)
  return (
    <div>
      <Title sub="Small steps. Real progress. Collect badges as you learn.">Achievement</Title>
      <div className={`${card} mb-5`}>
        <div className="text-[24px] font-bold text-[#92dd8c]">{got.length ? 'Your hard work is showing!' : 'Your collection starts here'}</div>
        <div className="text-[#a7abae]">{got.length} of {all.length} achievements unlocked</div>
      </div>
      {got.length > 0 && <><h3 className="mb-2 text-[20px] font-bold">UNLOCKED</h3><div className="mb-5 grid gap-3 sm:grid-cols-3">{got.map((a) => <Item key={a.name} a={a} />)}</div></>}
      <h3 className="mb-2 text-[20px] font-bold">NEXT MILESTONES</h3>
      <div className="grid gap-3 sm:grid-cols-3">{next.map((a) => <Item key={a.name} a={a} />)}</div>
    </div>
  )
}
