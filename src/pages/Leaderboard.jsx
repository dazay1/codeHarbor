import { card, Avatar, Title } from '../ui'
import binary from '../assets/binary.png'
import ozyImg from '../assets/ozy.png'

export default function Leaderboard({ s }) {
  const rows = board(s), rank = rows.findIndex((r) => r.me) + 1
  const above = rows[rank - 2]
  return (
    <div>
      <Title sub="Keep coding. Every lesson moves you up the ranks.">Leaderboard</Title>
      <div className={`${card} mb-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3"><span className="text-[44px]">🏆</span>
          <div><div className="text-[26px] font-bold text-[#e9b655]">{league(s.xp)} League</div><div className="text-[#a7abae]">Weekly ranking · ends in {7 - dow()} day{7 - dow() > 1 ? 's' : ''}</div></div></div>
        <img src={binary} alt="" className="h-16" />
      </div>
      <div className="mb-3 rounded bg-[#30353e] px-3 py-2 text-[#92dd8c]">
        {rank === 1 ? "You're #1! Keep it up." : `You're #${rank}. ${above.x - s.xp + 1} OZY to pass ${above.n}.`}
      </div>
      <div className={`${card} !p-2`}>
        {rows.map((r, i) => (
          <div key={r.n} className={`flex items-center gap-3 rounded px-3 py-2 text-[19px] ${r.me ? 'border-2 border-[#04e5f1] bg-[#163b43]' : i % 2 ? '' : 'bg-[#2a2e35]'}`}>
            <span className="w-6 text-[#e9b655]">{i + 1}</span><Avatar n={r.n} me={r.me} />
            <span className={`flex-1 ${r.me ? 'font-bold text-[#04e5f1]' : ''}`}>{r.n}{r.me && ' · YOU'}</span>
            <span className="flex items-center gap-1.5 text-[#e9b655]"><img src={ozyImg} alt="" className="h-5" />{r.x}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
