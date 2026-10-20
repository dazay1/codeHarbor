import React, { useEffect, useRef, useState } from 'react';
import { FileText, Globe, Terminal, FlaskConical, Check, X, Lock, Flame, Lightbulb, ArrowUpRight, Folder, Pause } from 'lucide-react';

const pad = 'px-[clamp(24px,6vw,96px)]';
const eyebrow = 'flex items-center gap-[9px] font-plex text-[10px] uppercase tracking-[0.1em]';
const eyebrowDot = 'inline-block size-[7px] bg-signal';
const revealBase = 'opacity-0 transition-[opacity,translate] duration-[760ms] ease-harbor motion-reduce:translate-none motion-reduce:opacity-100 [&.is-visible]:translate-none [&.is-visible]:opacity-100';
const reveal = `${revealBase} translate-y-7`;

// Each mock re-plays its small entrance animation whenever its feature becomes active.
const enter = 'animate-feature-in motion-reduce:animate-none';
const stagger = (i) => ({ animationDelay: `${0.15 + i * 0.12}s` });

// How long a feature stays on screen before the next one takes over (matches the bar's fill).
const SECONDS = 7;

function TabBar({ tabs, active }) {
    return (
        <div className="flex h-11 flex-none items-center gap-6 border-b border-ink/10 px-5 text-[12px] text-ink/60">
            {tabs.map(([Icon, label]) => (
                <span className={`relative flex h-full items-center gap-2 ${label === active ? 'font-medium text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-sage' : ''}`} key={label}>
                    <Icon size={13} strokeWidth={1.8} /> {label}
                </span>
            ))}
        </div>
    );
}

function TaskMock() {
    const files = [
        [Folder, 'tip-calculator', false, false],
        [FileText, 'index.html', true, false],
        [FileText, 'styles.css', true, false],
        [FileText, 'app.js', true, false],
        [FileText, 'TASK.md', false, true],
        [FileText, 'README.md', false, false],
    ];
    const steps = [
        ['Read the bill from the input', 'done'],
        ['Wire up the 10%, 15% and 20% buttons', 'done'],
        ['Show the total, rounded to cents', 'now'],
        ['Handle an empty bill without breaking', 'todo'],
    ];
    return (
        <div className="flex h-full flex-col">
            <TabBar tabs={[[FileText, 'Editor'], [Globe, 'Preview'], [Terminal, 'Terminal']]} active="Editor" />
            <div className="grid min-h-0 flex-1 grid-cols-[176px_1fr] max-[720px]:grid-cols-1">
                <div className="border-r border-ink/10 bg-[#f5f6f8] p-4 font-plex text-[11px] text-ink/70 max-[720px]:hidden">
                    <div className="mb-3 text-[9px] uppercase tracking-[0.14em] text-muted">Explorer</div>
                    {files.map(([Icon, name, nested, open]) => (
                        <div className={`flex items-center gap-2 whitespace-nowrap rounded-[5px] py-[5px] ${nested ? 'pl-6' : 'pl-2'} ${open ? 'bg-ink/[0.07] text-ink' : ''}`} key={name}>
                            <Icon size={12} strokeWidth={1.8} className={`flex-none ${open ? 'text-sage' : 'text-ink/45'}`} /> {name}
                        </div>
                    ))}
                </div>
                <div className="p-7 max-[720px]:p-5">
                    <div className="font-plex text-[10px] text-muted">TASK.md</div>
                    <h4 className={`mt-4 font-editorial text-[29px] leading-[1.05] tracking-[-0.01em] ${enter}`} style={stagger(0)}>Task: make the tip buttons work</h4>
                    <p className={`mt-3 max-w-[380px] text-[12.5px] leading-[1.6] text-ink/70 ${enter}`} style={stagger(1)}>
                        You’re working inside a small, real app. The bill input already exists. The tip buttons don’t do anything yet.
                    </p>
                    <div className="mt-5 border-t border-ink/10 pt-4 text-[12px] font-semibold">Your checklist</div>
                    <ul className="mt-3 flex flex-col gap-2.5 text-[12.5px]">
                        {steps.map(([label, state], i) => (
                            <li className={`flex items-center gap-2.5 ${state === 'todo' ? 'text-ink/50' : 'text-ink/80'} ${enter}`} style={stagger(i + 2)} key={label}>
                                <span className={`flex size-4 flex-none items-center justify-center rounded-[4px] border ${state === 'done' ? 'border-sage bg-sage text-white' : state === 'now' ? 'border-signal bg-signal/25' : 'border-ink/25'}`}>
                                    {state === 'done' && <Check size={11} strokeWidth={3} />}
                                </span>
                                <span className={state === 'done' ? 'line-through decoration-ink/30' : ''}>{label}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

function ProgressMock() {
    const lessons = [
        ['Variables', 'done'],
        ['Conditions', 'done'],
        ['Loops', 'now'],
        ['Functions', 'locked'],
        ['Project', 'locked'],
    ];
    return (
        <div className="flex h-full flex-col p-7 max-[720px]:p-5">
            <div className="flex items-center justify-between">
                <div>
                    <div className="font-plex text-[10px] uppercase tracking-[0.14em] text-muted">Your path</div>
                    <h4 className="mt-2 font-editorial text-[29px] leading-none tracking-[-0.01em]">Python foundations</h4>
                </div>
                <span className="rounded-full border border-ink/15 px-3 py-1.5 font-plex text-[10px] uppercase tracking-[0.12em] text-ink/70">Unit 2</span>
            </div>

            <ol className="relative mt-9 grid grid-cols-5">
                <span className="absolute left-[10%] right-[10%] top-[17px] h-px bg-ink/15" aria-hidden="true"></span>
                <span className={`absolute left-[10%] top-[17px] h-px w-[40%] origin-left bg-ink ${enter}`} style={stagger(1)} aria-hidden="true"></span>
                {lessons.map(([label, state], i) => (
                    <li className={`relative flex flex-col items-center gap-3 ${enter}`} style={stagger(i)} key={label}>
                        <span className={`flex size-[35px] items-center justify-center rounded-full border ${state === 'done' ? 'border-ink bg-ink text-paper' : state === 'now' ? 'border-signal bg-signal text-ink shadow-[0_0_0_6px_rgba(231,184,74,0.25)]' : 'border-dashed border-ink/30 bg-white text-ink/40'}`}>
                            {state === 'done' && <Check size={15} strokeWidth={2.6} />}
                            {state === 'now' && <span className="font-plex text-[11px] font-semibold">3</span>}
                            {state === 'locked' && <Lock size={13} strokeWidth={1.8} />}
                        </span>
                        <span className={`text-[11.5px] ${state === 'locked' ? 'text-ink/45' : 'text-ink/80'}`}>{label}</span>
                    </li>
                ))}
            </ol>

            <div className="mt-9 grid grid-cols-2 gap-4 max-[720px]:grid-cols-1">
                <div className={`rounded-[10px] border border-ink/10 p-4 ${enter}`} style={stagger(5)}>
                    <div className="flex items-center justify-between text-[12px] font-semibold">
                        This week <span className="flex items-center gap-1.5 font-plex text-[10px] font-normal text-ember"><Flame size={13} strokeWidth={1.8} /> 5-day streak</span>
                    </div>
                    <div className="mt-4 grid grid-cols-7 gap-1.5">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                            <div className="flex flex-col items-center gap-1.5" key={i}>
                                <span className={`block h-7 w-full rounded-[4px] ${i < 5 ? 'bg-signal' : 'bg-ink/[0.07]'}`}></span>
                                <span className="font-plex text-[9px] text-muted">{day}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`flex flex-col rounded-[10px] border border-ink/10 p-4 ${enter}`} style={stagger(6)}>
                    <div className="text-[12px] font-semibold">Next up</div>
                    <div className="mt-2 font-editorial text-[22px] leading-none">Loops</div>
                    <div className="mt-1.5 font-plex text-[10px] text-muted">Lesson 3 of 5 · about 8 min</div>
                    <span className="mt-auto inline-flex h-8 items-center justify-center gap-2 self-start rounded-[6px] bg-ink px-3.5 text-[11.5px] font-medium text-paper">
                        Continue <ArrowUpRight size={13} strokeWidth={2} />
                    </span>
                </div>
            </div>
        </div>
    );
}

function FeedbackMock() {
    const code = [
        ['function tipFor(input, rate) {', false],
        ['  const bill = parseFloat(input.value)', true],
        ['  return bill * rate', false],
        ['}', false],
    ];
    const tests = [
        ['adds a 15% tip', true, null],
        ['rounds to cents', true, null],
        ['handles an empty bill', false, 'expected 0, got NaN'],
    ];
    return (
        <div className="flex h-full flex-col">
            <TabBar tabs={[[FileText, 'Editor'], [FlaskConical, 'Tests'], [Terminal, 'Terminal']]} active="Tests" />
            <div className="p-7 max-[720px]:p-5">
                <div className="font-plex text-[10px] text-muted">app.js</div>
                <pre className={`mt-3 overflow-hidden rounded-[10px] bg-[#f5f6f8] py-3 font-plex text-[11.5px] leading-[1.9] text-ink/85 ${enter}`} style={stagger(0)}>
                    {code.map(([line, flagged], i) => (
                        <span className={`flex ${flagged ? 'bg-ember/10 shadow-[inset_2px_0_0_var(--color-ember)]' : ''}`} key={i}>
                            <span className="w-9 flex-none select-none pr-3 text-right text-ink/35">{i + 1}</span>
                            {line}
                        </span>
                    ))}
                </pre>
                <ul className="mt-5 flex flex-col gap-2.5 text-[12.5px]">
                    {tests.map(([label, passed, detail], i) => (
                        <li className={`flex items-center gap-2.5 ${enter}`} style={stagger(i + 1)} key={label}>
                            <span className={`flex size-[18px] flex-none items-center justify-center rounded-full text-white ${passed ? 'bg-sage' : 'bg-ember'}`}>
                                {passed ? <Check size={11} strokeWidth={3} /> : <X size={11} strokeWidth={3} />}
                            </span>
                            <span className="text-ink/85">{label}</span>
                            {detail && <span className="font-plex text-[10.5px] text-ember">{detail}</span>}
                        </li>
                    ))}
                </ul>
                <div className={`mt-5 flex gap-3 rounded-[10px] border border-signal/50 bg-signal/15 p-4 text-[12.5px] leading-[1.55] text-ink/85 ${enter}`} style={stagger(4)}>
                    <Lightbulb size={16} strokeWidth={1.8} className="mt-0.5 flex-none text-ink" />
                    <p>
                        <strong className="font-semibold">Line 2:</strong> <code className="font-plex text-[11.5px]">parseFloat("")</code> gives <code className="font-plex text-[11.5px]">NaN</code>. What should the bill be when the field is empty?
                    </p>
                </div>
            </div>
        </div>
    );
}

function ProofMock() {
    const projects = [
        ['Tip calculator', 'JavaScript', 'bg-[#dff0e6]', <><span className="h-2 w-12 rounded-full bg-ink/80"></span><span className="flex gap-1.5"><i className="size-5 rounded-[5px] bg-sage"></i><i className="size-5 rounded-[5px] bg-ink/15"></i><i className="size-5 rounded-[5px] bg-ink/15"></i></span></>],
        ['Weather card', 'HTML & CSS', 'bg-[#fdeccb]', <><span className="size-8 rounded-full bg-signal"></span><span className="h-2 w-10 rounded-full bg-ink/70"></span></>],
        ['Reading list', 'Python', 'bg-[#e6e0fa]', <><span className="h-2 w-14 rounded-full bg-ink/75"></span><span className="h-2 w-10 rounded-full bg-ink/30"></span><span className="h-2 w-12 rounded-full bg-ink/30"></span></>],
    ];
    return (
        <div className="flex h-full flex-col p-7 max-[720px]:p-5">
            <div className="font-plex text-[10px] uppercase tracking-[0.14em] text-muted">Your portfolio</div>
            <h4 className="mt-2 font-editorial text-[29px] leading-none tracking-[-0.01em]">Things you’ve built</h4>
            <div className="mt-7 grid grid-cols-3 gap-4 max-[720px]:grid-cols-2">
                {projects.map(([title, stack, tint, art], i) => (
                    <div className={`overflow-hidden rounded-[10px] border border-ink/10 ${i === 2 ? 'max-[720px]:hidden' : ''} ${enter}`} style={stagger(i)} key={title}>
                        <div className={`flex h-[104px] flex-col items-center justify-center gap-2.5 ${tint}`}>{art}</div>
                        <div className="p-3.5">
                            <div className="text-[12.5px] font-semibold">{title}</div>
                            <div className="mt-1 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-plex text-[9.5px] text-muted">
                                {stack} <span className="flex items-center gap-1 text-[#4f7a5c]"><Check size={10} strokeWidth={3} /> Finished</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className={`mt-5 flex items-center justify-between rounded-[10px] border border-ink/10 bg-[#f5f6f8] px-4 py-3.5 ${enter}`} style={stagger(4)}>
                <div>
                    <div className="text-[12.5px] font-semibold">One link for all of it</div>
                    <div className="mt-0.5 text-[11.5px] text-ink/65">Share your projects with anyone, code included.</div>
                </div>
                <span className="flex size-9 flex-none items-center justify-center rounded-full bg-ink text-paper"><ArrowUpRight size={15} strokeWidth={2} /></span>
            </div>
        </div>
    );
}

const features = [
    {
        id: 'tasks',
        title: 'Real code, zero toy examples',
        text: 'Step straight into actual components and scripts. You will wire up logic, build features, and fix live bugs—just like a working developer.',
        Mock: TaskMock,
        wash: 'radial-gradient(80% 70% at 100% 0%, #d8f0df 0%, transparent 62%), radial-gradient(70% 80% at 0% 100%, #cfe3fb 0%, transparent 66%), #f0f4f3',
    },
    {
        id: 'progress',
        title: 'Momentum you can measure',
        text: 'Bite-sized sessions fit any schedule. Keep your daily streak alive and watch a clear, structured roadmap turn confusion into total clarity.',
        Mock: ProgressMock,
        wash: 'radial-gradient(80% 70% at 100% 0%, #fdebbd 0%, transparent 62%), radial-gradient(70% 80% at 0% 100%, #ffd8c6 0%, transparent 66%), #f7f3ec',
    },
    {
        id: 'feedback',
        title: 'Instant hints, not hand-outs',
        text: 'Test your logic on the fly and pinpoint exact failures. Get sharp, contextual guidance that teaches you how to think, never just the raw answer.',
        Mock: FeedbackMock,
        wash: 'radial-gradient(80% 70% at 100% 0%, #d3efec 0%, transparent 62%), radial-gradient(70% 80% at 0% 100%, #e2dbfb 0%, transparent 66%), #f1f3f7',
    },
    {
        id: 'proof',
        title: 'A portfolio that speaks for itself',
        text: 'Leave behind hollow certificates. Graduate every milestone with working projects you built yourself, ready to showcase with a single link.',
        Mock: ProofMock,
        wash: 'radial-gradient(80% 70% at 100% 0%, #ffdccf 0%, transparent 62%), radial-gradient(70% 80% at 0% 100%, #f4dbee 0%, transparent 66%), #f7f1f1',
    },
];

function Why() {
    const [active, setActive] = useState(0);
    const [inView, setInView] = useState(false);
    const [hovered, setHovered] = useState(false);
    const stageRef = useRef(null);

    // The timer only runs while the feature list is actually on screen.
    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const playing = inView && !hovered;
    const next = () => setActive((i) => (i + 1) % features.length);

    return (
        <section className={`bg-paper py-[145px] max-[720px]:py-[95px] ${pad}`} id="proof">
            <div className="mx-auto max-w-[1200px]">
                <div className={reveal} data-reveal>
                    <div className={`${eyebrow} text-muted`}>
                        <span className={eyebrowDot}></span> Why Harbor
                    </div>
                    <h2 className="mt-6 max-w-[900px] font-editorial text-[length:clamp(46px,5.6vw,84px)] leading-[0.98] tracking-[-0.02em]">
                        Learn the way you’ll <em className="text-ember">actually work.</em>
                    </h2>
                </div>

                <div
                    className={`mt-16 grid grid-cols-[0.82fr_1.18fr] items-end gap-[clamp(32px,5vw,80px)] max-[980px]:grid-cols-1 max-[720px]:mt-12 ${reveal}`}
                    data-reveal
                    ref={stageRef}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                >
                    <div>
                        {features.map((feature, i) => {
                            const open = i === active;
                            return (
                                <div className={open ? 'pb-8' : ''} key={feature.id}>
                                    <button
                                        className={`block w-full cursor-pointer py-4 text-left font-editorial text-[length:clamp(28px,2.7vw,36px)] leading-[1.1] tracking-[-0.01em] transition-colors duration-300 ${open ? 'text-ink' : 'text-ink/35 hover:text-ink/70'}`}
                                        type="button"
                                        aria-expanded={open}
                                        aria-controls={`why-${feature.id}`}
                                        onClick={() => setActive(i)}
                                    >
                                        {feature.title}
                                    </button>
                                    <div
                                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-harbor ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                                        id={`why-${feature.id}`}
                                    >
                                        <div className="overflow-hidden">
                                            <p className="max-w-[440px] text-[17px] leading-[1.55] text-ink/75">{feature.text}</p>
                                            <span className="mt-8 block h-0.5 w-full overflow-hidden bg-ink/15">
                                                {open && (
                                                    <span
                                                        className="block h-full origin-left animate-feature-fill bg-ink motion-reduce:animate-none"
                                                        style={{ animationDuration: `${SECONDS}s`, animationPlayState: playing ? 'running' : 'paused' }}
                                                        onAnimationEnd={next}
                                                        key={feature.id}
                                                    ></span>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="mt-6 flex items-center gap-4 font-plex text-[10px] uppercase tracking-[0.16em] text-muted">
                            <span>
                                <span className="text-ink">{String(active + 1).padStart(2, '0')}</span> / {String(features.length).padStart(2, '0')}
                            </span>
                            <span className={`flex items-center gap-1.5 transition-opacity duration-300 motion-reduce:hidden ${hovered ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true">
                                <Pause size={11} strokeWidth={2} /> Paused
                            </span>
                        </div>
                    </div>

                    <div className="relative h-[580px] overflow-hidden rounded-[22px] border border-ink/[0.06] max-[980px]:h-[520px] max-[720px]:h-[500px]" aria-hidden="true">
                        {features.map((feature, i) => (
                            <div
                                className={`absolute inset-0 transition-opacity duration-700 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                                style={{ background: feature.wash }}
                                key={feature.id}
                            ></div>
                        ))}
                        {features.map(({ id, Mock }, i) => (
                            <div
                                className={`absolute bottom-0 left-[8%] right-0 top-[13%] overflow-hidden rounded-tl-[14px] border-l border-t border-ink/10 bg-white shadow-[0_30px_80px_-30px_rgba(18,20,26,0.4)] transition duration-700 ease-harbor max-[720px]:left-[5%] max-[720px]:top-[8%] ${i === active ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'}`}
                                key={id}
                            >
                                <Mock key={i === active ? 'on' : 'off'} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Why;
