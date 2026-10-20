import { useRef, useState, useEffect } from 'react'
import { LESSONS as FALLBACK_LESSONS } from './lessons'
import binary from './assets/binary.png'
import happy from './assets/binary-happy.png'
import sad from './assets/binary-sad.png'

const BTN = 'w-full rounded-[7px] border-x-2 border-t-2 border-b-[5px] px-5 py-3 text-[18px] font-bold uppercase transition active:translate-y-0.5'
const PRIMARY = `${BTN} border-[#69ffff] bg-[#04e5f1] text-[#16191f] hover:brightness-110`
const OFF = `${BTN} cursor-not-allowed border-[#4b5362] bg-[#30353e] text-[#a7abae]`

export default function LessonModal({ lessonData, index, done, lives, hints, onClose, onDone, onMiss, onHint }) {
  const review = typeof index === 'number' && index < done
  const [l, setL] = useState(lessonData || FALLBACK_LESSONS[index] || null)
  const [explanations, setExplanations] = useState([])

  // Navigation State
  const [step, setStep] = useState(0) // 0: Overview, 1: Explanations/Exercises
  const [slide, setSlide] = useState(0) // Current explanation slide
  const [loading, setLoading] = useState(true)

  // Quiz State
  const [pick, setPick] = useState(null)
  const [res, setRes] = useState(null)
  const [gone, setGone] = useState([])
  const [errs, setErrs] = useState(0)
  const t0 = useRef(Date.now())

  // Reset & Fetch state when lesson changes
  useEffect(() => {
    setStep(0)
    setSlide(0)
    setPick(null)
    setRes(null)
    setGone([])
    setErrs(0)
    t0.current = Date.now()

    const lessonId = lessonData?.id || (typeof index === 'number' ? index + 1 : null)
    if (!lessonId) {
      setLoading(false)
      return
    }

    setLoading(true)
    fetch(`http://127.0.0.1:8000/api/lessons/${lessonId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          // Normalize explanations array
          const exps = Array.isArray(data.explanations) ? data.explanations : []
          setExplanations(exps)

          // Normalize first exercise if available
          const ex = Array.isArray(data.exercises) && data.exercises.length > 0 ? data.exercises[0] : null

          setL((prev) => ({
            ...prev,
            id: data.id || prev?.id,
            code: data.code || prev?.code,
            title: data.title || prev?.title,
            ozy: data.ozyReward || data.ozy_reward || prev?.ozy || 15,
            opts: ex?.options || ex?.opts || prev?.opts || prev?.options || [],
            q: ex?.prompt || ex?.q || ex?.question || prev?.q || prev?.question || '',
            // Save raw correct answer (can be "<h1>", 2, "2", etc.)
            a: ex?.correctAnswer !== undefined ? ex.correctAnswer : ex?.a !== undefined ? ex.a : prev?.a,
            why: ex?.explanation || ex?.why || prev?.why || ''
          }))
        }
      })
      .catch((err) => console.warn('Using local lesson fallback:', err))
      .finally(() => setLoading(false))
  }, [lessonData, index])

  if (!l) return null

  // Helpers
  const opts = Array.isArray(l.opts) ? l.opts : []
  const questionText = l.q || ''
  // Ensure answerIndex is parsed safely
  // Resolve the numeric index of the correct answer
  const resolveAnswerIndex = () => {
    const rawAnswer = l.a !== undefined ? l.a : l.answer

    // If correct_answer in DB is a string match like "<h1>"
    if (typeof rawAnswer === 'string' && opts.includes(rawAnswer)) {
      return opts.indexOf(rawAnswer)
    }

    // If correct_answer in DB is a numeric index (1-based or 0-based index)
    const num = Number(rawAnswer)
    if (!isNaN(num)) {
      // Check if 1-based index (e.g. 1, 2, 3, 4) and adjust to 0-based if needed
      if (num > 0 && num <= opts.length && !opts[num]) {
        return num - 1
      }
      return num
    }

    return 0
  }

  const answerIndex = resolveAnswerIndex()

  const hasTheory = explanations.length > 0
  const isViewingTheory = hasTheory && slide < explanations.length
  const hasExercise = opts.length > 0 && questionText.trim().length > 0

  const hint = () => {
    const choices = opts.map((_, i) => i).filter((i) => i !== answerIndex && i !== pick && !gone.includes(i))
    if (choices.length) {
      setGone([...gone, choices[0]])
      onHint()
    }
  }

  const noLives = lives <= 0 && !review

  const check = () => {
    // Compare selected option text or index against correct answer
    const selectedOpt = opts[pick]
    const rawAnswer = l.a !== undefined ? l.a : l.answer

    const ok = pick === answerIndex || selectedOpt === rawAnswer

    setRes(ok ? 'ok' : 'bad')
    if (!ok) {
      setErrs((prev) => prev + 1)
      if (!review) onMiss()
    }
  }

  const retry = () => {
    setRes(null)
    setPick(null)
  }

  const handleFinish = () => {
    onDone(index, {
      mistakes: errs,
      secs: Math.round((Date.now() - t0.current) / 1000)
    })
  }

  const optCls = (i) => {
    if (res && i === pick) return res === 'ok' ? 'border-[#92dd8c] bg-[#2c4a33]' : 'border-[#e87879] bg-[#4a2c2f]'
    return pick === i ? 'border-[#04e5f1] bg-[#163b43]' : 'border-[#4b5362] bg-[#30353e] hover:border-[#04e5f1]'
  }

  const currentExp = explanations[slide]
  const codeExample = currentExp?.codeExample || currentExp?.code_example

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-3 sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[620px] rounded-[5px] border-2 border-[#4b5362] bg-[#24272d] p-5 shadow-[0_4px_8px_rgba(0,0,0,.38)]">

        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-[16px] font-bold text-[#92dd8c]">
              {l.code || 'LESSON'} {review && <span className="ml-2 text-[#e9b655]">PRACTICE</span>}
            </div>
            <div className="text-[28px] font-bold leading-tight">{l.title || 'Interactive Lesson'}</div>
          </div>
          <button onClick={onClose} className="text-[28px] leading-none text-[#a7abae] hover:text-white">×</button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center gap-4 py-14 text-center text-[#04e5f1]" role="status">
            <span className="size-9 animate-spin rounded-full border-[3px] border-[#04e5f1]/25 border-t-[#04e5f1]"></span>
            <span className="text-[15px] font-bold">Preparing your lesson…</span>
          </div>
        ) : step === 0 ? (
          /* STEP 0: Overview Screen */
          <>
            <div className="mb-2 text-[#a7abae]">Topics in this lesson:</div>
            <ul className="mb-5 space-y-2">
              {(l.topics || ['Concept Explanations', 'Interactive Exercises']).map((t) => (
                <li key={t} className="rounded bg-[#30353e] px-3 py-2 text-[18px]">
                  <span className="mr-2 text-[#04e5f1]">▸</span>{t}
                </li>
              ))}
            </ul>
            <button className={PRIMARY} onClick={() => setStep(1)}>
              Start Task · +{l.ozy || 15} OZY
            </button>
          </>
        ) : isViewingTheory ? (
          /* STEP 1: Explanation Slides */
          <>
            <div className="mb-2 flex items-center justify-between text-[14px] text-[#a7abae]">
              <span>Explanation {slide + 1} of {explanations.length}</span>
            </div>
            <div className="mb-4 rounded-lg border border-[#4b5362] bg-[#16191f] p-4">
              <div className="mb-2 text-[20px] font-bold text-[#6edcf0]">{currentExp.title}</div>
              <p className="text-[17px] leading-relaxed text-[#ecebdc]">{currentExp.content}</p>

              {/* Code Example Section */}
              {codeExample && (
                <pre className="mt-3 overflow-x-auto rounded bg-[#0d1015] p-3 font-mono text-[15px] text-[#92dd8c]">
                  <code>{codeExample}</code>
                </pre>
              )}
            </div>
            <button
              className={PRIMARY}
              onClick={() => setSlide((prev) => prev + 1)}
            >
              {slide + 1 < explanations.length
                ? 'Next Slide'
                : hasExercise
                  ? 'Start Exercise'
                  : 'Finish Lesson'}
            </button>
          </>
        ) : hasExercise ? (
          /* STEP 2: Exercise Screen */
          <>
            <div className="mb-4 flex items-center gap-3">
              <img src={res === 'ok' ? happy : res === 'bad' ? sad : binary} alt="" className="h-16" />
              <div className="text-[22px] font-bold leading-snug">{questionText}</div>
            </div>

            <div className="mb-4 space-y-2">
              {opts.map((o, i) => (
                <button
                  key={o}
                  disabled={res === 'ok' || noLives || gone.includes(i)}
                  onClick={() => !res && setPick(i)}
                  className={`${gone.includes(i) ? 'opacity-30 line-through' : ''} flex w-full items-center gap-3 rounded-[7px] border-2 px-4 py-3 text-left text-[18px] transition ${optCls(i)}`}
                >
                  <span className="text-[#a7abae]">{i + 1}</span>
                  <code className="font-mono text-[16px]">{o}</code>
                </button>
              ))}
            </div>

            {!res && hints > 0 && gone.length < opts.length - 1 && (
              <button onClick={hint} className="mb-3 text-[16px] text-[#e9b655] hover:underline">
                💡 Use hint ({hints})
              </button>
            )}

            {res && (
              <div className={`mb-3 rounded border-2 p-3 ${res === 'ok' ? 'border-[#92dd8c] bg-[#16311f] text-[#92dd8c]' : 'border-[#e87879] bg-[#3a2022] text-[#e87879]'}`}>
                <div className="text-[20px] font-bold">
                  {res === 'ok' ? (review ? 'Correct!' : `Correct! +${l.ozy || 15} OZY`) : 'Not quite. Try again!'}
                </div>
                {l.why ? <div className="text-[16px] text-[#ecebdc]">{l.why}</div> : null}
              </div>
            )}

            {noLives && <div className="mb-3 text-[#e87879]">No lives remaining. Restores every 30s.</div>}

            {res === 'ok' ? (
              <button className={PRIMARY} onClick={handleFinish}>
                Continue
              </button>
            ) : res === 'bad' ? (
              <button className={PRIMARY} onClick={retry}>
                Try again
              </button>
            ) : (
              <button className={pick === null || noLives ? OFF : PRIMARY} disabled={pick === null || noLives} onClick={check}>
                Check answer
              </button>
            )}
          </>
        ) : (
          /* STEP 3: Fallback Completion */
          <div className="py-6 text-center">
            <img src={happy} alt="" className="mx-auto mb-3 h-20" />
            <div className="mb-2 text-[22px] font-bold text-[#92dd8c]">Lesson Complete!</div>
            <p className="mb-6 text-[#a7abae]">You have completed all explanations for this lesson.</p>
            <button className={PRIMARY} onClick={handleFinish}>
              Claim +{l.ozy || 15} OZY
            </button>
          </div>
        )}
      </div>
    </div>
  )
}