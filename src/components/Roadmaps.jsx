import React, { useState } from 'react';
import {
    LayoutTemplate, Server, Layers, ChartColumn, Workflow,
    FileCode, Palette, Braces, GitBranch, Smartphone, Component, ShieldCheck, Rocket,
    Terminal, Database, Plug, FlaskConical, Container, Cloud, Activity, Network, Repeat,
    Table, Sigma, ChartPie, PanelsTopLeft, MessageSquareText, Flag, ArrowUpRight, ArrowRight,
} from 'lucide-react';

const pad = 'px-[clamp(24px,6vw,96px)]';
const eyebrow = 'flex items-center gap-[9px] font-plex text-[10px] uppercase tracking-[0.1em]';
const eyebrowDot = 'inline-block size-[7px] bg-signal';
const revealBase = 'opacity-0 transition-[opacity,translate] duration-[760ms] ease-harbor motion-reduce:translate-none motion-reduce:opacity-100 [&.is-visible]:translate-none [&.is-visible]:opacity-100';
const reveal = `${revealBase} translate-y-7`;
const enter = 'animate-feature-in motion-reduce:animate-none';

// Steps are [icon, name, what it gives you, has a course on Harbor today].
const roadmaps = [
    {
        id: 'frontend',
        Icon: LayoutTemplate,
        title: 'Frontend developer',
        summary: 'Builds everything people see and touch in the browser.',
        goal: ['A portfolio site', 'Designed, built and published by you'],
        steps: [
            [FileCode, 'HTML', 'The structure of every page', true],
            [Palette, 'CSS', 'Layout, color and type', true],
            [Braces, 'JavaScript', 'Logic and interaction', true],
            [GitBranch, 'Git & GitHub', 'Save and share your work', true],
            [Smartphone, 'Responsive design', 'One layout, every screen', false],
            [Component, 'React', 'Interfaces made of components', false],
            [ShieldCheck, 'TypeScript', 'Catch mistakes before users do', false],
            [Rocket, 'Testing & deploy', 'Ship it and keep it working', false],
        ],
    },
    {
        id: 'backend',
        Icon: Server,
        title: 'Backend developer',
        summary: 'Builds the logic, data and APIs behind every app.',
        goal: ['A live API', 'With a database, logins and tests'],
        steps: [
            [Braces, 'Python', 'Your first language', true],
            [GitBranch, 'Git & GitHub', 'Save and share your work', true],
            [Terminal, 'Command line', 'Work the way servers do', false],
            [Database, 'SQL & databases', 'Store and query data', true],
            [Plug, 'APIs', 'Let apps talk to each other', false],
            [ShieldCheck, 'Auth & security', 'Logins done safely', false],
            [FlaskConical, 'Testing', 'Prove your code works', false],
            [Container, 'Docker & deploy', 'Run it anywhere', false],
        ],
    },
    {
        id: 'fullstack',
        Icon: Layers,
        title: 'Full-stack developer',
        summary: 'Takes an idea from an empty page to a working product.',
        goal: ['A complete product', 'Frontend, backend and database'],
        steps: [
            [FileCode, 'HTML & CSS', 'Pages that look right', true],
            [Braces, 'JavaScript', 'Logic and interaction', true],
            [GitBranch, 'Git & GitHub', 'Save and share your work', true],
            [Component, 'React', 'Interfaces made of components', false],
            [Server, 'Node.js', 'JavaScript on the server', false],
            [Database, 'SQL & databases', 'Store and query data', true],
            [ShieldCheck, 'Auth & security', 'Logins done safely', false],
            [Rocket, 'Deployment', 'Put it on the internet', false],
        ],
    },
    {
        id: 'data',
        Icon: ChartColumn,
        title: 'Data analyst',
        summary: 'Turns raw numbers into answers people can act on.',
        goal: ['An analysis report', 'A real dataset, cleaned and explained'],
        steps: [
            [Braces, 'Python', 'Your first language', true],
            [Database, 'SQL', 'Ask questions of a database', true],
            [GitBranch, 'Git & GitHub', 'Keep your work versioned', true],
            [Table, 'pandas', 'Clean and reshape data', false],
            [Sigma, 'Statistics', 'Know what the numbers mean', false],
            [ChartPie, 'Visualization', 'Charts that tell the truth', false],
            [PanelsTopLeft, 'Dashboards', 'Answers that stay up to date', false],
            [MessageSquareText, 'Storytelling', 'Explain what you found', false],
        ],
    },
    {
        id: 'devops',
        Icon: Workflow,
        title: 'DevOps engineer',
        summary: 'Keeps software shipping quickly and running reliably.',
        goal: ['An automated pipeline', 'From a commit to a live deploy'],
        steps: [
            [Terminal, 'Linux & shell', 'Home base for every server', false],
            [Network, 'Networking', 'How machines find each other', false],
            [GitBranch, 'Git & GitHub', 'Save and share your work', true],
            [Braces, 'Python scripting', 'Automate the boring parts', true],
            [Container, 'Docker', 'Package apps to run anywhere', false],
            [Repeat, 'CI/CD', 'Test and ship on every change', false],
            [Cloud, 'Cloud basics', 'Rent computers by the minute', false],
            [Activity, 'Monitoring', 'Know before your users do', false],
        ],
    },
];

const dotted = 'pointer-events-none absolute border-dotted border-signal/45';

// One stop on the map. Stops snake across three columns: left to right, then back again.
function Stop({ index, total, Icon, name, note, live, isGoal }) {
    const row = Math.floor(index / 3);
    const forward = row % 2 === 0;
    const place = index % 3;
    const col = forward ? place : 2 - place;
    const last = index === total - 1;
    return (
        <li
            className={`relative flex h-[158px] flex-col items-center text-center ${enter}`}
            style={{ gridRow: row + 1, gridColumn: col + 1, animationDelay: `${index * 0.07}s` }}
        >
            {!last && place < 2 && (
                <span className={`${dotted} top-[31px] border-t-2 ${forward ? 'left-[calc(50%+40px)] right-[calc(-50%+40px)]' : 'left-[calc(-50%+40px)] right-[calc(50%+40px)]'}`} aria-hidden="true"></span>
            )}
            {!last && place === 2 && (
                <span className={`${dotted} top-[31px] h-[158px] w-[30px] border-2 ${forward ? 'left-[calc(50%+40px)] rounded-r-[30px] border-l-0' : 'right-[calc(50%+40px)] rounded-l-[30px] border-r-0'}`} aria-hidden="true"></span>
            )}
            <span className={`relative flex size-[62px] items-center justify-center rounded-[16px] border transition-transform duration-300 hover:-translate-y-1 ${isGoal ? 'border-dashed border-signal/70 bg-signal/10 text-signal' : index === 0 ? 'border-signal bg-signal text-ink shadow-[0_0_28px_-6px_rgba(231,184,74,0.7)]' : 'border-paper/15 bg-paper/[0.06] text-paper'}`}>
                <Icon size={24} strokeWidth={1.6} aria-hidden="true" />
                <span className={`absolute -right-2 -top-2 flex size-[22px] items-center justify-center rounded-full border font-plex text-[10px] ${index === 0 ? 'border-signal bg-[#0a0b10] text-signal' : 'border-paper/25 bg-[#0a0b10] text-paper/85'}`}>
                    {isGoal ? <Flag size={10} strokeWidth={2.2} aria-hidden="true" /> : index + 1}
                </span>
            </span>
            <span className="mt-3 flex items-center gap-1.5 text-[13.5px] font-medium tracking-[-0.01em]">
                {name}
                {live && <span className="size-[6px] flex-none rounded-full bg-signal" title="Course available now"></span>}
            </span>
            <span className="mt-1 max-w-[150px] text-[11.5px] leading-[1.4] text-paper/65">{note}</span>
        </li>
    );
}

function Roadmaps() {
    const [activeId, setActiveId] = useState(roadmaps[0].id);
    const active = roadmaps.find((roadmap) => roadmap.id === activeId);
    const stops = [...active.steps, [Flag, active.goal[0], active.goal[1], false]];
    const liveCount = active.steps.filter((step) => step[3]).length;

    return (
        <section className={`border-t border-line-light bg-[#0a0b10] py-[135px] text-paper max-[720px]:py-[95px] ${pad}`} id="method">
            <div className="mx-auto max-w-[1200px]">
                <div className={`flex items-end justify-between gap-x-16 gap-y-8 max-[980px]:flex-col max-[980px]:items-start ${reveal}`} data-reveal>
                    <div>
                        <div className={`${eyebrow} text-paper/70`}>
                            <span className={eyebrowDot}></span> Career roadmaps
                        </div>
                        <h2 className="mt-6 font-editorial text-[length:clamp(46px,5.6vw,84px)] leading-[0.98] tracking-[-0.02em]">
                            A profession,
                            <br />
                            <em className="text-signal">not just a language.</em>
                        </h2>
                    </div>
                    <p className="max-w-[360px] pb-2 text-[15px] leading-[1.65] text-paper/70">
                        Pick where you want to end up. Each roadmap puts the tools in the order a good mentor would teach them, so you always know the next step.
                    </p>
                </div>

                <div className={`mt-16 grid grid-cols-[0.78fr_1.22fr] items-start gap-[clamp(28px,4vw,64px)] max-[980px]:grid-cols-1 max-[720px]:mt-12 ${reveal}`} data-reveal>
                    <div className="flex flex-col gap-2 max-[980px]:grid max-[980px]:grid-cols-3 max-[720px]:grid-cols-2">
                        {roadmaps.map(({ id, Icon, title, summary, steps }) => {
                            const on = id === activeId;
                            return (
                                <button
                                    className={`group flex cursor-pointer items-center gap-4 rounded-[16px] border p-4 text-left transition duration-300 max-[980px]:gap-3 max-[980px]:p-3 ${on ? 'border-paper/15 bg-paper/[0.07]' : 'border-transparent hover:bg-paper/[0.04]'}`}
                                    type="button"
                                    aria-pressed={on}
                                    key={id}
                                    onClick={() => setActiveId(id)}
                                >
                                    <span className={`flex size-12 flex-none items-center justify-center rounded-[12px] transition-colors duration-300 max-[980px]:size-10 ${on ? 'bg-signal text-ink' : 'bg-paper/[0.07] text-paper/65 group-hover:text-paper'}`}>
                                        <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className={`block font-editorial text-[27px] leading-[1.05] tracking-[-0.01em] transition-colors duration-300 max-[980px]:text-[22px] max-[720px]:text-[19px] ${on ? 'text-paper' : 'text-paper/55 group-hover:text-paper'}`}>{title}</span>
                                        <span className={`mt-1 block text-[13px] leading-[1.45] max-[980px]:hidden ${on ? 'text-paper/75' : 'text-paper/50'}`}>{summary}</span>
                                    </span>
                                    <span className={`flex-none font-plex text-[10px] uppercase tracking-[0.12em] transition-opacity duration-300 max-[980px]:hidden ${on ? 'text-signal opacity-100' : 'opacity-0'}`}>
                                        {steps.length + 1} steps
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="relative overflow-hidden rounded-[22px] border border-signal/70 bg-[#050608] text-paper shadow-[0_0_0_1px_rgba(231,184,74,0.12),0_0_90px_-20px_rgba(231,184,74,0.45)]">
                        <div className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(rgba(231,184,74,0.16)_1px,transparent_1.2px)] [background-size:22px_22px] [mask-image:linear-gradient(black,transparent_85%)]" aria-hidden="true"></div>
                        <div className="pointer-events-none absolute -right-24 -top-24 size-[320px] rounded-full bg-signal/20 blur-[90px]" aria-hidden="true"></div>

                        <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-signal/70 px-8 py-6 max-[720px]:px-5">
                            <div>
                                <div className="font-plex text-[10px] uppercase tracking-[0.16em] text-signal">Roadmap</div>
                                <h3 className={`mt-1.5 font-editorial text-[32px] leading-none tracking-[-0.01em] ${enter}`} key={active.id}>{active.title}</h3>
                            </div>
                            <a className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-signal px-5 text-[13px] font-semibold text-ink transition duration-180 hover:bg-signal-soft" href="#paths">
                                Start this path <ArrowUpRight size={15} strokeWidth={2} className="transition-transform duration-180 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                            </a>
                        </div>

                        {/* Desktop and tablet: the snaking map */}
                        <ol className="relative grid grid-cols-3 px-10 pb-2 pt-10 max-[720px]:hidden" key={`${active.id}-map`}>
                            {stops.map(([Icon, name, note, live], i) => (
                                <Stop index={i} total={stops.length} Icon={Icon} name={name} note={note} live={live} isGoal={i === stops.length - 1} key={name} />
                            ))}
                        </ol>

                        {/* Phones: the same steps as a simple list */}
                        <ol className="relative hidden flex-col px-5 py-6 max-[720px]:flex" key={`${active.id}-list`}>
                            {stops.map(([Icon, name, note, live], i) => {
                                const isGoal = i === stops.length - 1;
                                return (
                                    <li className={`relative flex items-center gap-4 pb-5 last:pb-0 ${enter}`} style={{ animationDelay: `${i * 0.05}s` }} key={name}>
                                        {!isGoal && <span className={`${dotted} bottom-0 left-[23px] top-12 border-l-2`} aria-hidden="true"></span>}
                                        <span className={`flex size-12 flex-none items-center justify-center rounded-[13px] border ${isGoal ? 'border-dashed border-signal/70 bg-signal/10 text-signal' : i === 0 ? 'border-signal bg-signal text-ink' : 'border-paper/15 bg-paper/[0.06]'}`}>
                                            <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
                                        </span>
                                        <span>
                                            <span className="flex items-center gap-1.5 text-[14px] font-medium">
                                                {name}
                                                {live && <span className="size-[6px] rounded-full bg-signal"></span>}
                                            </span>
                                            <span className="block text-[12px] text-paper/65">{note}</span>
                                        </span>
                                        <span className="ml-auto font-plex text-[10px] text-paper/55">{isGoal ? 'Goal' : String(i + 1).padStart(2, '0')}</span>
                                    </li>
                                );
                            })}
                        </ol>

                        <div className="relative flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-signal/70 px-8 py-5 font-plex text-[10px] uppercase tracking-[0.14em] text-paper/70 max-[720px]:px-5">
                            <span className="flex items-center gap-2.5">
                                <span className="size-[6px] rounded-full bg-signal"></span>
                                {liveCount} of {active.steps.length} have a course on Harbor today
                            </span>
                            <a className="inline-flex items-center gap-2 text-signal underline-offset-4 hover:underline" href="#paths">
                                Begin with {active.steps[0][1]} <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Roadmaps;
