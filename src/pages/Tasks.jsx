import { useRef, useState } from 'react'
import { LESSONS } from '../lessons'
import { TASKS } from '../tasks'
import { card, PRIMARY, OFF, Title } from '../ui'
import binary from '../assets/binary.png'
import happy from '../assets/binary-happy.png'
import sad from '../assets/binary-sad.png'

const LOOP = /while\s*\(\s*(true|1)\s*\)|for\s*\(\s*;\s*;\s*\)/

// Запуск кода в скрытом sandbox-iframe (без доступа к странице). Тест возвращает ok/err/out через postMessage.
const run = (code, test, kind) => new Promise((resolve) => {
  if (LOOP.test(code)) return resolve({ ok: false, err: 'Похоже на бесконечный цикл. Проверьте условие выхода.', out: [] })
  const id = Math.random().toString(36).slice(2)
  const f = document.createElement('iframe')
  f.sandbox = 'allow-scripts'
  f.style.display = 'none'
  const finish = (r) => { clearTimeout(timer); window.removeEventListener('message', on); f.remove(); resolve(r) }
  const on = (e) => { if (e.data && e.data.id === id) finish(e.data) }
  const timer = setTimeout(() => finish({ ok: false, err: 'Нет ответа: проверьте синтаксис.', out: [] }), 2500)
  window.addEventListener('message', on)
  const post = `parent.postMessage({id:'${id}',ok:ok,err:err,out:o},'*')`
  f.srcdoc = kind === 'js'
    ? `<script>var o=[],ok=false,err;console.log=function(){o.push([].slice.call(arguments).join(' '))};try{ok=!!eval(${JSON.stringify(code + '\n;(' + test + ')').replace(/</g, '\\u003c')})}catch(e){err=String(e)};${post}<\/script>`
    : `${code}<script>addEventListener('load',function(){var o=[],ok=false,err;try{ok=!!(${test})}catch(e){err=String(e)};${post}})<\/script>`
  document.body.appendChild(f)
})

const wrap = (c) => `<!doctype html><meta charset="utf-8"><style>body{font:16px sans-serif;margin:12px;color:#111}</style>${c}`

function Editor({ i, review: r0, onPass, next }) {
  const [review] = useState(r0) // фиксируем режим на момент открытия
  
  const l = LESSONS[i], [start, re, hint, test, kind] = TASKS[i]
  const [code, setCode] = useState(start)
  const [res, setRes] = useState(null)
  const [out, setOut] = useState([])
  const [err, setErr] = useState('')
  const [live, setLive] = useState(null) // для DOM-заданий: запущенная версия страницы
  const [busy, setBusy] = useState(false)
  const m = useRef(0), t0 = useRef(Date.now())

  const check = async () => {
    setBusy(true)
    let ok = !re || new RegExp(re, 'i').test(code), o = [], e = ''
    if (ok && test) { const r = await run(code, test, kind); ok = r.ok; o = r.out || []; e = r.err || '' }
    if (kind === 'dom' && !LOOP.test(code)) setLive(code)
    setOut(o); setErr(e); setRes(ok ? 'ok' : 'bad'); setBusy(false)
    if (ok) { if (!review) onPass(i, { mistakes: m.current, secs: Math.round((Date.now() - t0.current) / 1000) }) } else m.current++
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
      <div className={card}>
        <div className="mb-1 text-[16px] font-bold text-[#92dd8c]">{l.code} {review && <span className="ml-2 text-[#e9b655]">PRACTICE</span>}</div>
        <h2 className="mb-1 text-[26px] font-bold leading-tight text-[#04e5f1]">{l.title}</h2>
        <p className="mb-1 text-[#a7abae]">1 exercise · +{l.ozy} OZY</p>
        <p className="mb-3 text-[18px]">{l.topics.join(' · ')}</p>
        <div className="overflow-hidden rounded border border-[#4b5362] bg-[#16191f]">
          <div className="border-b border-[#4b5362] bg-[#24272d] px-3 py-1.5 text-[15px]"><b>{kind === 'js' ? 'script.js' : 'index.html'}</b> <span className="text-[#a7abae]">{kind === 'js' ? 'JavaScript' : 'HTML'}</span></div>
          <textarea value={code} onChange={(e) => { setCode(e.target.value); setRes(null); setLive(null) }} spellCheck={false}
            className="block h-[220px] w-full resize-y bg-transparent p-3 font-mono text-[15px] leading-6 text-[#ecebdc] outline-none" />
        </div>
        {res === 'ok' && <div className="mt-3 rounded border-2 border-[#92dd8c] bg-[#16311f] p-3 text-[#92dd8c]"><b className="text-[20px]">Correct! {review ? '' : `+${l.ozy} OZY`}</b><div className="text-[#ecebdc]">{l.why}</div></div>}
        {res === 'bad' && <div className="mt-3 rounded border-2 border-[#e87879] bg-[#3a2022] p-3"><b className="text-[20px] text-[#e87879]">Not quite. Try again!</b><div>{err ? <code className="text-[14px] text-[#e87879]">{err}</code> : hint}</div>{err && <div className="mt-1 text-[15px] text-[#a7abae]">{hint}</div>}</div>}
        <div className="mt-3">
          {res === 'ok' && next ? <button className={`${PRIMARY} w-full`} onClick={next}>Next task</button>
            : <button className={`${busy ? OFF : PRIMARY} w-full`} disabled={busy} onClick={check}>{kind ? 'Run & check' : 'Check code'}</button>}
        </div>
      </div>
      <div className={card}>
        {kind === 'js' ? (
          <>
            <div className="mb-2 text-[18px] font-bold">CONSOLE</div>
            <div className="h-[170px] overflow-auto rounded bg-[#16191f] p-2 font-mono text-[14px] text-[#92dd8c]">
              {out.length ? out.map((x, k) => <div key={k}>&gt; {x}</div>) : <span className="text-[#a7abae]">Нажмите Run &amp; check, чтобы увидеть вывод console.log.</span>}
            </div>
          </>
        ) : (
          <>
            <div className="mb-2 text-[18px] font-bold">LIVE PREVIEW</div>
            <iframe title="preview" sandbox={kind === 'dom' && live !== null ? 'allow-scripts' : ''} srcDoc={wrap(kind === 'dom' && live !== null ? live : code.replace(/<script[\s\S]*?<\/script>/gi, ''))} className="h-[170px] w-full rounded bg-white" />
            <div className="mt-2 text-center text-[14px] text-[#a7abae]">{kind === 'dom' ? 'Скрипты запускаются по кнопке Run & check.' : 'Your HTML appears here as you build it.'}</div>
          </>
        )}
        <img src={res === 'ok' ? happy : res === 'bad' ? sad : binary} alt="" className="mx-auto my-2 h-[90px]" />
        <div className="text-center text-[15px] text-[#92dd8c]">Binary: “{res === 'bad' ? 'Не сдавайся, прочитай подсказку!' : 'Пиши код и смотри результат!'}”</div>
      </div>
    </div>
  )
}

export default function Tasks({ done, onComplete }) {
  const last = LESSONS.length - 1
  const [sel, setSel] = useState(Math.min(done, last))
  const rows = [done - 1, done + 1, done + 2].filter((i) => i >= 0 && i <= last)
  return (
    <div>
      <Title sub="Practice a little every day. Build your skills, one lesson at a time.">Tasks</Title>
      {done > last && <div className={`${card} mb-4 text-[#92dd8c]`}>🏆 Все задания пройдены! Можно повторить любой урок.</div>}
      <Editor key={sel} i={sel} review={sel < done} onPass={onComplete} next={sel < last ? () => setSel(sel + 1) : null} />
      <div className="mt-4 space-y-2">
        {rows.map((i) => (
          <button key={i} disabled={i > done} onClick={() => { setSel(i); window.scrollTo(0, 0) }}
            className={`${card} flex w-full items-center justify-between text-left ${i > done ? 'opacity-60' : 'hover:border-[#04e5f1]'}`}>
            <div><div className="text-[20px] font-bold">{LESSONS[i].code} {LESSONS[i].title}</div><div className="text-[15px] text-[#a7abae]">{i < done ? 'Completed · Practice' : 'Locked'}</div></div>
            <span className="text-[22px] text-[#a7abae]">{i > done ? '🔒' : '›'}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
