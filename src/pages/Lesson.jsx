import React, { useRef, useState } from 'react';
import Loader from '../components/Loader';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight, FileCode, Lightbulb, List, Play, RotateCcw, Zap, CircleAlert, Terminal } from 'lucide-react';
import { courses } from '../components/Path';
import LearnBar, { Inline } from '../components/LearnBar';
import { playableOf, xpOf, exerciseKey } from '../data/curriculum';
import { useProgress } from '../learn/progress';
import { useCourse } from '../learn/backend';
import { run } from '../learn/runners';

const label = 'font-plex text-[10px] uppercase tracking-[0.14em]';
const toolButton = 'inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] border border-paper/15 px-3.5 text-[13px] text-paper/85 transition duration-180 hover:border-paper/40 hover:text-paper disabled:cursor-wait disabled:opacity-60';

// What the pane under the editor is called for each kind of course.
const outputName = { web: 'Preview', sql: 'Result' };

function Body({ blocks }) {
    return blocks.map(([kind, content], i) => {
        if (kind === 'h') return <h2 className="mt-9 font-editorial text-[28px] leading-[1.1]" key={i}>{content}</h2>;
        if (kind === 'code') return <pre className="mt-4 overflow-x-auto rounded-[12px] border border-paper/10 bg-paper/[0.05] p-4 font-plex text-[13.5px] leading-[1.7] text-paper" key={i}>{content}</pre>;
        if (kind === 'list') {
            return (
                <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-6 text-[16px] leading-[1.6] text-paper/85 marker:text-signal" key={i}>
                    {content.map((item) => <li key={item}><Inline text={item} /></li>)}
                </ul>
            );
        }
        return <p className="mt-4 text-[16px] leading-[1.65] text-paper/85" key={i}><Inline text={content} /></p>;
    });
}

// A plain code editor: a textarea with a line-number gutter that scrolls with it.
function Editor({ value, onChange, indent }) {
    const gutter = useRef(null);
    const count = value.split('\n').length;
    const onKeyDown = (e) => {
        if (e.key !== 'Tab') return;
        e.preventDefault();
        const { selectionStart, selectionEnd } = e.target;
        const next = value.slice(0, selectionStart) + indent + value.slice(selectionEnd);
        onChange(next);
        requestAnimationFrame(() => e.target.setSelectionRange(selectionStart + indent.length, selectionStart + indent.length));
    };
    return (
        <div className="flex min-h-0 flex-1 bg-[#0d1017] font-plex text-[14px] leading-[1.75]">
            <div className="w-12 flex-none select-none overflow-hidden py-4 pr-3 text-right text-paper/35" ref={gutter} aria-hidden="true">
                {Array.from({ length: count }, (_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <textarea
                className="min-h-0 flex-1 resize-none whitespace-pre bg-transparent py-4 pr-4 text-paper caret-signal outline-none"
                aria-label="Code editor"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={onKeyDown}
                onScroll={(e) => { if (gutter.current) gutter.current.scrollTop = e.target.scrollTop; }}
            ></textarea>
        </div>
    );
}

// A coding exercise: instructions on the left, editor and output on the right.
function CodePanes({ course, exercise, done, onSolved }) {
    const [code, setCode] = useState(exercise.starter);
    const [result, setResult] = useState(null);
    const [verdict, setVerdict] = useState(null);
    const [busy, setBusy] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [everRan, setEverRan] = useState(false);
    const pane = outputName[course.runner] || 'Terminal';

    const execute = async (submit) => {
        setBusy(true);
        setVerdict(null);
        const outcome = await run(course, code);
        setEverRan(true);
        setResult(outcome);
        setBusy(false);
        if (!submit) return;
        if (outcome.error) {
            setVerdict({ ok: false, text: 'Fix the error above, then submit again.' });
            setShowHint(true);
            return;
        }
        const doc = outcome.doc ?? new DOMParser().parseFromString('', 'text/html');
        const checked = exercise.check({ code, output: outcome.output, doc, rows: outcome.rows ?? [], columns: outcome.columns ?? [] });
        if (checked === true) {
            onSolved();
            setVerdict({ ok: true, text: done ? 'Correct again. Nicely done.' : `Correct! You earned ${xpOf(exercise)} XP.` });
        } else {
            setVerdict({ ok: false, text: checked || 'Not quite yet. Read the task once more and try again.' });
            setShowHint(true);
        }
    };

    return (
        <>
            {/* Instructions */}
            <section className="flex min-h-0 flex-col border-r border-paper/10 max-[980px]:border-r-0">
                <div className={`${label} flex h-11 flex-none items-center border-b border-paper/10 bg-paper/[0.03] px-6 text-paper/70`}>Exercise</div>
                <div className="min-h-0 flex-1 overflow-y-auto px-[clamp(20px,3vw,40px)] pb-12 pt-8">
                    <h1 className="font-editorial text-[length:clamp(36px,4vw,52px)] leading-[1.02] tracking-[-0.01em]">
                        <span className="text-signal">{exercise.number}.</span> {exercise.title}
                    </h1>
                    <Body blocks={exercise.body} />

                    <div className="mt-9 rounded-[14px] border border-signal/50 bg-signal/[0.07] p-5">
                        <div className={`${label} flex items-center gap-2 text-signal`}><Zap size={13} strokeWidth={2} aria-hidden="true" /> Your task</div>
                        <p className="mt-3 whitespace-pre-line text-[16px] leading-[1.65] text-paper"><Inline text={exercise.task} /></p>
                    </div>

                    {showHint && (
                        <div className="mt-4 rounded-[14px] border border-paper/15 bg-paper/[0.04] p-5">
                            <div className={`${label} flex items-center gap-2 text-paper/70`}><Lightbulb size={13} strokeWidth={2} aria-hidden="true" /> Hint</div>
                            <pre className="mt-3 whitespace-pre-wrap font-plex text-[13.5px] leading-[1.7] text-paper/90">{exercise.hint}</pre>
                        </div>
                    )}
                </div>
            </section>

            {/* Editor and output */}
            <section className="flex min-h-0 flex-col max-[980px]:border-t max-[980px]:border-paper/10">
                <div className="flex h-11 flex-none items-center border-b border-paper/10 bg-paper/[0.03]">
                    <span className="flex h-full items-center gap-2 border-r border-paper/10 bg-[#0d1017] px-5 text-[13px] font-medium shadow-[inset_0_2px_0_var(--color-signal)]">
                        <FileCode size={14} strokeWidth={1.8} className="text-signal" aria-hidden="true" /> {course.file}
                    </span>
                </div>

                <div className="flex min-h-[260px] flex-[3] flex-col">
                    <Editor value={code} onChange={setCode} indent={course.runner === 'python' ? '    ' : '  '} />
                    <div className="flex flex-none flex-wrap items-center justify-between gap-3 border-t border-paper/10 bg-[#0d1017] px-4 py-3">
                        <div className="flex gap-2">
                            <button className={toolButton} type="button" onClick={() => { setCode(exercise.starter); setResult(null); setVerdict(null); }}>
                                <RotateCcw size={14} strokeWidth={1.8} aria-hidden="true" /> Reset
                            </button>
                            <button className={toolButton} type="button" aria-pressed={showHint} onClick={() => setShowHint((value) => !value)}>
                                <Lightbulb size={14} strokeWidth={1.8} aria-hidden="true" /> Hint
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <button className={toolButton} type="button" disabled={busy} onClick={() => execute(false)}>
                                <Play size={14} strokeWidth={1.8} aria-hidden="true" /> Run
                            </button>
                            <button
                                className="inline-flex h-10 cursor-pointer items-center rounded-[10px] bg-signal px-4 text-[13px] font-semibold text-ink transition duration-180 hover:bg-signal-soft disabled:cursor-wait disabled:opacity-60"
                                type="button"
                                disabled={busy}
                                onClick={() => execute(true)}
                            >
                                Submit answer
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex min-h-[220px] flex-[2] flex-col border-t border-paper/10">
                    <div className={`${label} flex h-11 flex-none items-center gap-2 border-b border-paper/10 bg-paper/[0.03] px-5 text-paper/70`}>
                        <Terminal size={13} strokeWidth={1.8} aria-hidden="true" /> {pane}
                        {course.runner === 'git' && <span className="normal-case tracking-normal text-paper/45">(practice mode)</span>}
                    </div>
                    <div className="min-h-0 flex-1 overflow-auto" aria-live="polite">
                        {verdict && (
                            <div className={`flex items-start gap-2.5 border-b px-5 py-3.5 text-[14px] ${verdict.ok ? 'border-sage/40 bg-sage/15 text-[#bfe3c8]' : 'border-ember-soft/40 bg-ember/15 text-[#ffc9b3]'}`}>
                                {verdict.ok ? <Check size={16} strokeWidth={2.6} className="mt-0.5 flex-none" aria-hidden="true" /> : <CircleAlert size={16} strokeWidth={2} className="mt-0.5 flex-none" aria-hidden="true" />}
                                {verdict.text}
                            </div>
                        )}
                        {busy && <p className="px-5 py-4 font-plex text-[13px] text-paper/60">{course.runner === 'python' && !everRan ? 'Starting Python. The first run takes a few seconds…' : 'Running…'}</p>}
                        {!busy && !result && (
                            <div className="flex h-full min-h-[140px] flex-col items-center justify-center gap-3 px-6 text-center text-[14px] text-paper/55">
                                <Play size={22} strokeWidth={1.4} aria-hidden="true" />
                                <span>Press <strong className="font-semibold text-paper/85">Run</strong> to see your results</span>
                            </div>
                        )}
                        {!busy && result && (
                            <>
                                {result.html && <iframe className="block h-full min-h-[200px] w-full bg-white" title="Page preview" sandbox="" srcDoc={result.html}></iframe>}
                                {result.columns?.length > 0 && (
                                    <table className="w-full border-collapse font-plex text-[13px]">
                                        <thead>
                                            <tr>{result.columns.map((column) => <th className="border-b border-paper/15 px-5 py-2.5 text-left font-medium text-signal" key={column}>{column}</th>)}</tr>
                                        </thead>
                                        <tbody>
                                            {result.rows.map((row, r) => (
                                                <tr className="border-b border-paper/[0.07]" key={r}>{row.map((cell, c) => <td className="px-5 py-2 text-paper/90" key={c}>{String(cell)}</td>)}</tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                                {result.output && <pre className="whitespace-pre-wrap px-5 py-4 font-plex text-[13.5px] leading-[1.7] text-paper/90">{result.output}</pre>}
                                {result.error && <pre className="whitespace-pre-wrap px-5 py-4 font-plex text-[13.5px] leading-[1.7] text-[#ffb59c]">{result.error}</pre>}
                                {!result.html && !result.output && !result.error && !result.columns?.length && (
                                    <p className="px-5 py-4 font-plex text-[13px] text-paper/60">The code ran and printed nothing.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

// A lesson from the database: its slides on the left, its questions on the right.
function QuizPanes({ exercise, done, onSolved }) {
    const { slides, questions } = exercise;
    const [at, setAt] = useState(0);
    const [picked, setPicked] = useState(null);
    const [status, setStatus] = useState('idle'); // idle | wrong | right
    const [finished, setFinished] = useState(false);
    const [hintShown, setHintShown] = useState(false);
    const [answerShown, setAnswerShown] = useState(false);
    const [feedback, setFeedback] = useState('');
    const question = questions[at];
    const last = at === questions.length - 1;

    // Questions without options from the database are answered by typing.
    const typed = !!question && !(question.options && question.options.length > 0);
    // Typed answers ignore case, spacing and quote style, so `<p>Hello</p>` matches `<p> Hello </p>`.
    const normalize = (text) => String(text ?? '').replace(/[\u2018\u2019\u201c\u201d]/g, '"').replace(/'/g, '"').replace(/\s+/g, '').toLowerCase();
    // For fill-in-the-blank prompts ("... ___ Hello ___") the learner may type only what goes in the blanks.
    const blanksOf = (prompt, answer) => {
        const text = String(prompt ?? '');
        for (const part of [text, text.slice(text.indexOf(':') + 1)]) {
            if (!part.includes('___')) continue;
            const pattern = part.trim().split('___').map((piece) => piece.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s*')).join('(.+?)');
            const found = new RegExp(`^\\s*${pattern}\\s*$`, 'is').exec(String(answer ?? ''));
            if (found) return found.slice(1).join('');
        }
        return null;
    };
    const matches = (typedText, q) => {
        const typedNorm = normalize(typedText);
        if (typedNorm === normalize(q.correctAnswer)) return true;
        const blanks = blanksOf(q.prompt, q.correctAnswer);
        return blanks !== null && typedNorm.replace(/[,;]/g, '') === normalize(blanks);
    };
    // "code" questions have no stored answer: the explanation holds a sample solution and the snippet is the starter.
    const freeForm = !!question && (question.correctAnswer === null || question.correctAnswer === undefined || String(question.correctAnswer).trim() === '');
    const starter = freeForm ? String(question?.codeSnippet ?? '') : '';
    const value = picked ?? starter;
    const stripComments = (text) => String(text).replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*(\/\/|#|--).*$/gm, '').trim();
    const VOID = new Set(['br', 'hr', 'img', 'input', 'meta', 'link']);
    // Returns true, or a message saying what is missing.
    const gradeFreeForm = (text, q) => {
        const code = stripComments(text);
        if (!code || code === stripComments(q.codeSnippet ?? '')) return 'Write your own code above first.';
        const tags = [...new Set([...String(q.explanation ?? '').matchAll(/<([a-z][a-z0-9]*)\b[^>]*>/gi)].map((m) => m[1].toLowerCase()))];
        for (const tag of tags) {
            const hasTag = VOID.has(tag) ? new RegExp(`<${tag}\\b`, 'i').test(code) : new RegExp(`<${tag}\\b[^>]*>\\s*\\S[\\s\\S]*?</${tag}\\s*>`, 'i').test(code);
            if (!hasTag) return VOID.has(tag) ? `Add a <${tag}> element.` : `Add a <${tag}> element with some text inside it, and close it with </${tag}>.`;
        }
        return true;
    };
    const empty = value.trim() === '';

    const check = () => {
        const right = freeForm ? gradeFreeForm(value, question) === true : typed ? matches(picked, question) : String(picked).trim() === String(question.correctAnswer).trim();
        setStatus(right ? 'right' : 'wrong');
        setFeedback(freeForm && !right ? gradeFreeForm(value, question) : '');
    };
    const advance = () => {
        if (last) {
            setFinished(true);
            onSolved();
            return;
        }
        setAt(at + 1);
        setPicked(null);
        setStatus('idle');
        setHintShown(false);
        setAnswerShown(false);
        setFeedback('');
    };
    // A hint from the database explanation, or else the start of the answer.
    const hintText = freeForm ? (feedback && feedback !== 'Write your own code above first.' ? feedback : 'Look at the task again and write the code in the editor.') : question?.explanation || `The answer starts with "${String(question?.correctAnswer ?? '').trim().slice(0, 3)}…" and is ${String(question?.correctAnswer ?? '').trim().length} characters long.`;
    return (
        <>
            <section className="flex min-h-0 flex-col border-r border-paper/10 max-[980px]:border-r-0">
                <div className={`${label} flex h-11 flex-none items-center border-b border-paper/10 bg-paper/[0.03] px-6 text-paper/70`}>Lesson</div>
                <div className="min-h-0 flex-1 overflow-y-auto px-[clamp(20px,3vw,40px)] pb-12 pt-8">
                    <h1 className="font-editorial text-[length:clamp(36px,4vw,52px)] leading-[1.02] tracking-[-0.01em]">
                        <span className="text-signal">{exercise.number}.</span> {exercise.title}
                    </h1>
                    {slides.length === 0 && <p className="mt-4 text-[16px] leading-[1.65] text-paper/85">This lesson goes straight to the questions on the right.</p>}
                    {slides.map((slide) => (
                        <div key={slide.id}>
                            <h2 className="mt-9 font-editorial text-[28px] leading-[1.1]">{slide.title}</h2>
                            {String(slide.content || '').split('\n').filter((line) => line.trim()).map((line, i) => (
                                <p className="mt-4 text-[16px] leading-[1.65] text-paper/85" key={i}><Inline text={line} /></p>
                            ))}
                            {slide.codeExample && <pre className="mt-4 overflow-x-auto rounded-[12px] border border-paper/10 bg-paper/[0.05] p-4 font-plex text-[13.5px] leading-[1.7] text-paper">{slide.codeExample.trimEnd()}</pre>}
                            {slide.imageUrl && <img className="mt-4 max-w-full rounded-[12px]" src={slide.imageUrl} alt="" />}
                        </div>
                    ))}
                </div>
            </section>

            <section className="flex min-h-0 flex-col max-[980px]:border-t max-[980px]:border-paper/10">
                <div className={`${label} flex h-11 flex-none items-center justify-between border-b border-paper/10 bg-paper/[0.03] px-6 text-paper/70`}>
                    <span>Check yourself</span>
                    {questions.length > 0 && !finished && <span>Question {at + 1} of {questions.length}</span>}
                </div>
                <div className="flex min-h-[420px] flex-1 flex-col justify-center overflow-y-auto bg-[#0d1017] px-[clamp(20px,4vw,56px)] py-10" aria-live="polite">
                    <div className="mx-auto w-full max-w-[520px]">
                        {questions.length === 0 && (
                            <>
                                <p className="font-editorial text-[30px] leading-[1.15]">Nothing to answer yet.</p>
                                <p className="mt-3 text-[15px] leading-[1.6] text-paper/75">Read the lesson on the left, then mark it as done.</p>
                                <button className="mt-7 inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-signal px-6 text-[14px] font-semibold text-ink transition duration-180 hover:bg-signal-soft" type="button" onClick={onSolved}>
                                    <Check size={16} strokeWidth={2.6} aria-hidden="true" /> {done ? 'Marked as done' : 'Mark as done'}
                                </button>
                            </>
                        )}

                        {finished && (
                            <>
                                <span className="flex size-14 items-center justify-center rounded-full bg-signal text-ink"><Check size={26} strokeWidth={2.6} aria-hidden="true" /></span>
                                <p className="mt-6 font-editorial text-[36px] leading-[1.1]">Lesson complete.</p>
                                <p className="mt-3 text-[15px] leading-[1.6] text-paper/75">
                                    You answered {questions.length === 1 ? 'the question' : `all ${questions.length} questions`} correctly and earned {xpOf(exercise)} XP. Use <strong className="font-semibold text-paper">Next</strong> below to keep going.
                                </p>
                            </>
                        )}

                        {question && !finished && (
                            <>
                                <div className="flex gap-1.5" aria-hidden="true">
                                    {questions.map((item, i) => (
                                        <span className={`h-1 flex-1 rounded-full ${i < at ? 'bg-signal' : i === at ? 'bg-paper/60' : 'bg-paper/15'}`} key={item.id}></span>
                                    ))}
                                </div>
                                <p className="mt-7 font-editorial text-[length:clamp(26px,2.6vw,32px)] leading-[1.2]"><Inline text={question.prompt} /></p>
                                {question.codeSnippet && !freeForm && <pre className="mt-4 overflow-x-auto rounded-[12px] border border-paper/10 bg-paper/[0.05] p-4 font-plex text-[13.5px] leading-[1.7]">{question.codeSnippet}</pre>}

                                {typed && (
                                    <textarea
                                        className="mt-6 block min-h-[140px] w-full resize-y rounded-[12px] border border-paper/20 bg-paper/[0.05] p-4 font-plex text-[14.5px] leading-[1.7] text-paper caret-signal outline-none transition duration-180 placeholder:text-paper/35 focus:border-signal disabled:opacity-70"
                                        aria-label="Your answer"
                                        placeholder="Type your answer here…"
                                        spellCheck={false}
                                        autoCapitalize="off"
                                        autoCorrect="off"
                                        disabled={status === 'right'}
                                        value={value}
                                        onChange={(e) => { setPicked(e.target.value); setStatus('idle'); }}
                                        onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !empty && status !== 'right') check(); }}
                                    ></textarea>
                                )}

                                {!typed && <div className="mt-6 flex flex-col gap-2.5" role="radiogroup" aria-label="Answers">
                                    {question.options.map((option) => {
                                        const chosen = picked === option;
                                        const tone = !chosen
                                            ? 'border-paper/15 hover:border-paper/40'
                                            : status === 'right'
                                              ? 'border-sage bg-sage/15'
                                              : status === 'wrong'
                                                ? 'border-ember-soft bg-ember/15'
                                                : 'border-signal bg-signal/10';
                                        return (
                                            <button
                                                className={`flex min-h-[52px] cursor-pointer items-center gap-3.5 rounded-[12px] border px-4 py-3 text-left font-plex text-[14.5px] transition duration-180 disabled:cursor-default ${tone}`}
                                                type="button"
                                                role="radio"
                                                aria-checked={chosen}
                                                disabled={status === 'right'}
                                                key={option}
                                                onClick={() => { setPicked(option); setStatus('idle'); }}
                                            >
                                                <span className={`flex size-5 flex-none items-center justify-center rounded-full border ${chosen ? 'border-current' : 'border-paper/35'}`}>
                                                    {chosen && <span className="size-2.5 rounded-full bg-current"></span>}
                                                </span>
                                                {option}
                                            </button>
                                        );
                                    })}
                                </div>}

                                {status === 'wrong' && (
                                    <p className="mt-5 flex items-center gap-2.5 text-[14px] text-[#ffc9b3]"><CircleAlert size={16} strokeWidth={2} aria-hidden="true" /> {freeForm && feedback ? feedback : `Not quite. Look at the lesson again and ${typed ? 'edit your answer' : 'pick another answer'}.`}</p>
                                )}
                                {status === 'wrong' && (
                                    <div className="mt-4 flex flex-col gap-3">
                                        <div className="flex flex-wrap gap-2">
                                            <button className={toolButton} type="button" aria-pressed={hintShown} onClick={() => setHintShown(true)}>
                                                <Lightbulb size={14} strokeWidth={1.8} aria-hidden="true" /> Get a hint
                                            </button>
                                            <button className={toolButton} type="button" aria-pressed={answerShown} onClick={() => { setHintShown(true); setAnswerShown(true); }}>
                                                <Check size={14} strokeWidth={1.8} aria-hidden="true" /> Show answer
                                            </button>
                                        </div>
                                        {hintShown && (
                                            <div className="rounded-[12px] border border-paper/15 bg-paper/[0.04] p-4 text-[14.5px] leading-[1.55] text-paper/90">
                                                <div className={`${label} flex items-center gap-2 text-paper/70`}><Lightbulb size={13} strokeWidth={2} aria-hidden="true" /> Hint</div>
                                                <p className="mt-2"><Inline text={hintText} /></p>
                                            </div>
                                        )}
                                        {answerShown && (
                                            <div className="rounded-[12px] border border-signal/50 bg-signal/[0.07] p-4">
                                                <div className={`${label} text-signal`}>Answer</div>
                                                <pre className="mt-2 whitespace-pre-wrap font-plex text-[14px] leading-[1.7] text-paper">{freeForm ? String(question.explanation ?? '') : String(question.correctAnswer ?? '')}</pre>
                                                {typed && (
                                                    <button className={`${toolButton} mt-3`} type="button" onClick={() => { setPicked(freeForm ? String(question.explanation ?? '') : String(question.correctAnswer ?? '')); setStatus('idle'); }}>
                                                        Use this answer
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {status === 'right' && (
                                    <div className="mt-5 rounded-[12px] border border-sage/40 bg-sage/15 p-4 text-[14.5px] leading-[1.55] text-[#d2ecd9]">
                                        <div className="flex items-center gap-2 font-semibold"><Check size={16} strokeWidth={2.6} aria-hidden="true" /> Correct</div>
                                        {question.explanation && (freeForm ? <pre className="mt-2 whitespace-pre-wrap font-plex text-[13.5px]">{question.explanation}</pre> : <p className="mt-2"><Inline text={question.explanation} /></p>)}
                                    </div>
                                )}

                                <div className="mt-7">
                                    {status === 'right' ? (
                                        <button className="inline-flex h-12 cursor-pointer items-center gap-2 rounded-full bg-signal px-6 text-[14px] font-semibold text-ink transition duration-180 hover:bg-signal-soft" type="button" onClick={advance}>
                                            {last ? 'Finish lesson' : 'Next question'} <ChevronRight size={16} strokeWidth={2} aria-hidden="true" />
                                        </button>
                                    ) : (
                                        <button className="inline-flex h-12 cursor-pointer items-center rounded-full bg-signal px-6 text-[14px] font-semibold text-ink transition duration-180 hover:bg-signal-soft disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={empty} onClick={check}>
                                            Check answer
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

// The frame around one exercise. Remounted (via `key`) whenever the exercise changes, so its state starts clean.
function Workspace({ courseId, course, info, exercise, index, list }) {
    const { isDone, complete } = useProgress();
    const key = exerciseKey(courseId, exercise.chapter.id, exercise.id);
    const done = isDone(key);
    const inChapter = list.filter((item) => item.chapter.id === exercise.chapter.id);
    const position = inChapter.findIndex((item) => item.id === exercise.id);
    const chapterDone = inChapter.filter((item) => isDone(exerciseKey(courseId, item.chapter.id, item.id))).length;
    const percent = Math.round((chapterDone / inChapter.length) * 100);
    const previous = list[index - 1];
    const next = list[index + 1];
    const pathOf = (item) => `/course/${exerciseKey(courseId, item.chapter.id, item.id)}`;
    const Panes = exercise.kind === 'quiz' ? QuizPanes : CodePanes;
    const numbered = { ...exercise, number: String(position + 1).padStart(2, '0') };

    return (
        <div className="flex min-h-screen flex-col bg-[#0a0b10] font-grotesk text-paper antialiased selection:bg-signal selection:text-ink min-[981px]:h-screen">
            <LearnBar>
                <nav className="flex min-w-0 items-center gap-2 text-[14px]" aria-label="Breadcrumb">
                    <Link className="truncate text-paper/65 transition-colors duration-180 hover:text-paper" to={`/course/${courseId}`}>{info.title}</Link>
                    <span className="text-paper/35">/</span>
                    <span className="truncate font-medium">{exercise.chapter.title}</span>
                </nav>
                <div className="flex items-center gap-3 max-[720px]:hidden" aria-label={`Chapter progress ${percent}%`}>
                    <span className="block h-1.5 w-[160px] overflow-hidden rounded-full bg-paper/10">
                        <span className="block h-full rounded-full bg-signal transition-[width] duration-500" style={{ width: `${percent}%` }}></span>
                    </span>
                    <span className="font-plex text-[12px] text-paper/70">{percent}%</span>
                </div>
            </LearnBar>

            <div className="grid min-h-0 flex-1 grid-cols-2 max-[980px]:grid-cols-1">
                <Panes course={course} exercise={numbered} done={done} onSolved={() => complete(key)} />
            </div>

            {/* Bottom bar */}
            <footer className="flex h-[68px] flex-none items-center justify-between gap-4 border-t border-paper/10 bg-[#0a0b10] px-[clamp(16px,3vw,32px)]">
                <div className="flex min-w-0 items-center gap-4">
                    <Link className="flex size-11 flex-none items-center justify-center rounded-[10px] border border-paper/15 text-paper/85 transition duration-180 hover:border-paper/40" to={`/course/${courseId}`} aria-label="Back to all exercises">
                        <List size={18} strokeWidth={1.8} aria-hidden="true" />
                    </Link>
                    <div className="min-w-0">
                        <div className="truncate text-[15px] font-semibold">{exercise.title}</div>
                        <div className="mt-0.5 flex items-center gap-2.5 text-[12.5px] text-paper/60">
                            Exercise {position + 1} / {inChapter.length}
                            <span className={`${label} rounded-full px-2 py-0.5 ${done ? 'bg-signal text-ink' : 'bg-paper/10 text-paper/80'}`}>{done ? 'Done' : `${xpOf(exercise)} XP`}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-none gap-2.5">
                    {previous ? (
                        <Link className={toolButton} to={pathOf(previous)}><ChevronLeft size={15} strokeWidth={2} aria-hidden="true" /> <span className="max-[720px]:hidden">Back</span></Link>
                    ) : (
                        <span className={`${toolButton} pointer-events-none opacity-40`} aria-disabled="true"><ChevronLeft size={15} strokeWidth={2} aria-hidden="true" /> <span className="max-[720px]:hidden">Back</span></span>
                    )}
                    {done ? (
                        <Link className="inline-flex h-10 items-center gap-2 rounded-[10px] bg-signal px-4 text-[13px] font-semibold text-ink transition duration-180 hover:bg-signal-soft" to={next ? pathOf(next) : `/course/${courseId}`}>
                            {next ? 'Next' : 'Finish'} <ChevronRight size={15} strokeWidth={2} aria-hidden="true" />
                        </Link>
                    ) : (
                        <span className={`${toolButton} pointer-events-none opacity-40`} aria-disabled="true" title="Submit a correct answer to continue">Next <ChevronRight size={15} strokeWidth={2} aria-hidden="true" /></span>
                    )}
                </div>
            </footer>
        </div>
    );
}

export default function Lesson() {
    const { courseId, chapterId, exerciseId } = useParams();
    const info = courses.find((course) => course.id === courseId);
    const { course, loading } = useCourse(courseId);
    const { isDone } = useProgress();
    if (loading) return <Loader text="Opening your lesson" />;
    if (!info || !course) return <Navigate to="/" replace />;

    const list = playableOf(course);
    const index = list.findIndex((exercise) => exercise.chapter.id === chapterId && exercise.id === exerciseId);
    // Unknown or still-locked exercises go back to the course page.
    const locked = index > 0 && !isDone(exerciseKey(courseId, list[index - 1].chapter.id, list[index - 1].id));
    if (index === -1 || locked) return <Navigate to={`/course/${courseId}`} replace />;

    return <Workspace courseId={courseId} course={course} info={info} exercise={list[index]} index={index} list={list} key={`${courseId}/${chapterId}/${exerciseId}`} />;
}
