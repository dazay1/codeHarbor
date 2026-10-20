import { useState } from 'react'
import { SHOP } from '../game'
import { card, PRIMARY, OFF, Title } from '../ui'
import binary from '../assets/binary.png'
import ozyImg from '../assets/ozy.png'

export default function Shop({ s, buy }) {
  const [msg, setMsg] = useState('')
  const own = { lives: null, freeze: s.inv.freeze, dxp: Date.now() < s.dxp ? 'active' : null, hint: s.inv.hints, pass: s.inv.pass }
  return (
    <div>
      <Title sub="Spend your OZY on a little help for your next lesson.">Shop</Title>
      <div className={`${card} mb-5 flex items-center justify-between`}>
        <div className="flex items-center gap-4"><img src={binary} alt="" className="h-[84px]" />
          <div><div className="text-[24px] font-bold text-[#92dd8c]">Welcome to Binary&apos;s shop!</div><div className="text-[#a7abae]">Earn OZY by finishing lessons. Keep your streak going.</div></div></div>
        <div className="flex items-center gap-2 text-[26px] font-bold text-[#e9b655]"><img src={ozyImg} alt="" className="h-8" />{s.ozy.toLocaleString('en-US')}</div>
      </div>
      {msg && <div className="mb-3 text-[18px] text-[#e9b655]">{msg}</div>}
      {['POWER-UPS', 'BINARY EXTRAS'].map((g) => (
        <div key={g} className="mb-5">
          <h3 className="mb-2 text-[20px] font-bold">{g}</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {SHOP.filter((x) => x.group === g).map((it) => (
              <div key={it.id} className={`${card} flex flex-col`}>
                <div className="mb-2 flex h-14 items-center justify-center rounded bg-[#30353e] text-[34px]">{it.icon}</div>
                <div className="text-[20px] font-bold">{it.name}</div>
                <div className="mb-1 flex-1 text-[15px] text-[#a7abae]">{it.desc}</div>
                {own[it.id] ? <div className="mb-2 text-[14px] text-[#92dd8c]">Owned: {own[it.id]}</div> : null}
                <button className={`${s.ozy >= it.price ? PRIMARY : OFF} !py-1.5 !text-[16px]`} onClick={() => setMsg(buy(it.id))}>Buy · {it.price} OZY</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
