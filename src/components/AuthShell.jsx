import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ArrowLeft, Eye, EyeOff, CircleAlert } from 'lucide-react';

const still = 'motion-reduce:animate-none';
const noise = (x, seed) => {
    const v = Math.sin(x * 12.9898 + seed * 78.233) * 43758.5453;
    return v - Math.floor(v);
};
const r1 = (n) => Math.round(n * 10) / 10;

// A smooth ridgeline across the 600-wide artwork that fills down to the bottom edge.
function ridge({ y, amp, freq, phase, rough = 0, step = 10, seed = 1 }) {
    const pts = [];
    for (let x = -step; x <= 600 + step; x += step) {
        pts.push([x, y + amp * Math.sin(x * freq + phase) + amp * 0.5 * Math.sin(x * freq * 2.3 + phase * 1.7) + rough * (noise(x, seed) - 0.5) * 2]);
    }
    let d = `M${pts[0][0]} ${r1(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
        d += ` Q${pts[i][0]} ${r1(pts[i][1])} ${(pts[i][0] + pts[i + 1][0]) / 2} ${r1((pts[i][1] + pts[i + 1][1]) / 2)}`;
    }
    return `${d} L${600 + step} 800 L${-step} 800Z`;
}

// The harbor at night: the lighthouse the product is named after, drawn in SVG.
function HarborNight() {
    return (
        <svg className="block size-full" viewBox="0 0 600 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
                <linearGradient id="auth-sky" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#05071c" />
                    <stop offset="0.5" stopColor="#141a52" />
                    <stop offset="0.72" stopColor="#4a3a86" />
                    <stop offset="0.8" stopColor="#c9766e" />
                </linearGradient>
                <linearGradient id="auth-sea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#6d4a86" />
                    <stop offset="0.25" stopColor="#1d2260" />
                    <stop offset="1" stopColor="#05071c" />
                </linearGradient>
                <linearGradient id="auth-beam" x1="1" y1="0" x2="0" y2="0">
                    <stop offset="0" stopColor="#ffe9a0" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#ffe9a0" stopOpacity="0" />
                </linearGradient>
                <filter id="auth-soft" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="14" />
                </filter>
                <filter id="auth-grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.9 0 0 0 -0.35" />
                </filter>
            </defs>
            <rect width="600" height="800" fill="url(#auth-sky)" />
            <g fill="#ffffff">
                {Array.from({ length: 70 }, (_, i) => (
                    <circle
                        className={i % 5 === 0 ? `animate-twinkle ${still}` : undefined}
                        style={i % 5 === 0 ? { animationDelay: `${-noise(i, 9) * 3}s` } : undefined}
                        cx={r1(noise(i, 1) * 600)}
                        cy={r1(noise(i, 2) * 470)}
                        r={r1(0.5 + noise(i, 3) * 1.1)}
                        opacity={r1(0.35 + noise(i, 4) * 0.65)}
                        key={i}
                    />
                ))}
            </g>
            <circle cx="150" cy="170" r="70" fill="#fff6d6" opacity="0.35" filter="url(#auth-soft)" />
            <circle cx="150" cy="170" r="22" fill="#fff8e2" />
            <circle cx="143" cy="163" r="4" fill="#e9dcae" />
            <circle cx="157" cy="178" r="3" fill="#e9dcae" />
            <ellipse cx="300" cy="566" rx="380" ry="26" fill="#ffb48a" opacity="0.5" filter="url(#auth-soft)" />
            <path d={ridge({ y: 536, amp: 16, freq: 0.012, phase: 0.8 })} fill="#3a2f78" />
            <path d={ridge({ y: 552, amp: 9, freq: 0.02, phase: 2.6, rough: 3, step: 8, seed: 4 })} fill="#241d5c" />
            <rect y="570" width="600" height="230" fill="url(#auth-sea)" />
            <g className={`animate-twinkle ${still}`} fill="#fff1c9">
                {[[122, 584, 56], [112, 600, 76], [128, 618, 44], [116, 640, 68], [130, 664, 40], [120, 692, 58]].map(([x, y, w], i) => (
                    <rect x={x} y={y} width={w} height="2.4" rx="1.2" opacity={0.8 - i * 0.11} key={y} />
                ))}
            </g>
            <g className={`animate-drift ${still}`} stroke="#b7b0ff" strokeWidth="1.6" strokeLinecap="round" opacity="0.3">
                <path d="M40 640 h70 M250 610 h90 M210 700 h120 M60 740 h80 M330 760 h70" />
            </g>

            {/* The beam sweeps slowly from the lamp */}
            <path
                className={`animate-sway ${still}`}
                style={{ transformOrigin: '432px 372px', animationDuration: '9s' }}
                d="M432 372 L-60 250 L-60 470Z"
                fill="url(#auth-beam)"
            />
            <path d="M300 640 Q350 588 420 570 Q480 556 540 566 Q590 574 620 600 V800 H250 Q262 700 300 640Z" fill="#060718" />
            <path d="M420 570 Q480 556 540 566 Q590 574 620 600 V614 Q580 590 532 584 Q470 578 420 570Z" fill="#1a1a4a" />
            <circle cx="432" cy="372" r="60" fill="#ffe9a0" opacity="0.55" filter="url(#auth-soft)" />
            <path d="M408 572 L418 402 H446 L456 572Z" fill="#eeeaff" />
            <path d="M411.5 512 L414 470 H450 L452.5 512Z M417 424 L418 402 H446 L447 424Z" fill="#6f63e0" />
            <path d="M437 402 H446 L456 572 H442Z" fill="#05071c" opacity="0.22" />
            <rect x="406" y="394" width="52" height="8" fill="#12123a" />
            <rect x="418" y="356" width="28" height="38" fill="#ffe9a0" />
            <path d="M418 356 h28 M427.5 356 v38 M436.5 356 v38" stroke="#12123a" strokeWidth="2" />
            <path d="M410 356 L432 332 L454 356Z" fill="#12123a" />
            <rect x="430" y="322" width="4" height="12" fill="#12123a" />
            <rect x="424" y="540" width="16" height="32" rx="8" fill="#12123a" />
            <rect x="474" y="542" width="40" height="26" fill="#12123a" />
            <path d="M468 542 L494 524 L520 542Z" fill="#1a1a4a" />
            <rect className={`animate-twinkle ${still}`} x="486" y="550" width="8" height="9" fill="#ffd98a" />

            <g className={`animate-bob ${still}`} style={{ animationDuration: '5s' }}>
                <path d="M196 650 h70 l-10 15 h-50Z" fill="#05071c" />
                <path d="M230 650 V592 L266 644Z" fill="#eeeaff" opacity="0.92" />
                <path d="M226 650 V606 L204 644Z" fill="#cfc8ff" opacity="0.8" />
                <circle cx="260" cy="648" r="2.6" fill="#ffd54a" />
            </g>
            <rect width="600" height="800" filter="url(#auth-grain)" opacity="0.1" />
        </svg>
    );
}

function BeaconMark({ dark = false }) {
    return (
        <span className="relative inline-block h-[26px] w-[27px]" aria-hidden="true">
            <i className="absolute left-[7px] top-[3px] block h-[5px] w-[13px] bg-signal"></i>
            <b className={`absolute left-[5px] top-[10px] block h-[5px] w-[17px] ${dark ? 'bg-paper' : 'bg-ink'}`}></b>
            <em className={`absolute bottom-px left-[8px] block size-0 border-x-[5px] border-b-[5px] border-x-transparent ${dark ? 'border-b-paper' : 'border-b-ink'}`}></em>
        </span>
    );
}

// A labelled input with an optional show/hide toggle and an inline error line.
export function Field({ label, id, type = 'text', error, hint, trailing, ...props }) {
    const [shown, setShown] = useState(false);
    const isPassword = type === 'password';
    return (
        <div>
            <div className="flex items-baseline justify-between">
                <label className="font-plex text-[10px] uppercase tracking-[0.14em] text-ink/70" htmlFor={id}>{label}</label>
                {trailing}
            </div>
            <div className="relative mt-2">
                <input
                    className={`h-[52px] w-full rounded-[12px] border bg-white px-4 text-[15px] text-ink outline-none transition duration-180 placeholder:text-ink/35 focus:border-ink focus:shadow-[0_0_0_4px_rgba(231,184,74,0.35)] ${isPassword ? 'pr-12' : ''} ${error ? 'border-ember' : 'border-ink/15 hover:border-ink/35'}`}
                    id={id}
                    type={isPassword && shown ? 'text' : type}
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
                    {...props}
                />
                {isPassword && (
                    <button
                        className="absolute right-1.5 top-1/2 flex size-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-[9px] text-ink/55 transition-colors duration-180 hover:text-ink"
                        type="button"
                        aria-label={shown ? 'Hide password' : 'Show password'}
                        onClick={() => setShown((value) => !value)}
                    >
                        {shown ? <EyeOff size={18} strokeWidth={1.7} /> : <Eye size={18} strokeWidth={1.7} />}
                    </button>
                )}
            </div>
            {error ? (
                <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-ember" id={`${id}-error`}>
                    <CircleAlert size={13} strokeWidth={2} aria-hidden="true" /> {error}
                </p>
            ) : (
                hint && <p className="mt-2 text-[12.5px] text-ink/55" id={`${id}-hint`}>{hint}</p>
            )}
        </div>
    );
}

export function SubmitButton({ children, busy }) {
    return (
        <button
            className="group flex h-14 w-full cursor-pointer items-center justify-between rounded-full bg-ink pl-7 pr-2.5 text-[15px] font-semibold text-paper transition duration-180 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgba(18,20,26,0.7)] disabled:cursor-wait disabled:opacity-70"
            type="submit"
            disabled={busy}
        >
            {busy ? 'One moment…' : children}
            <span className="flex size-9 items-center justify-center rounded-full bg-signal text-ink transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
            </span>
        </button>
    );
}

// Two-column page: the form on the left, the night harbor on the right (hidden on small screens).
export default function AuthShell({ eyebrow, title, intro, children, footer, artTitle, artText, artPoints = [] }) {
    return (
        <div className="grid min-h-screen grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] bg-paper font-grotesk text-ink antialiased selection:bg-signal selection:text-ink max-[980px]:grid-cols-1">
            <div className="flex min-h-screen flex-col px-[clamp(24px,6vw,88px)] py-8">
                <header className="flex items-center justify-between">
                    <Link className="inline-flex items-center gap-[10px] text-[18px] font-bold tracking-[-0.07em]" to="/" aria-label="Code Harbor home">
                        <BeaconMark />
                        <span>code<span className="font-medium text-muted">harbor</span></span>
                    </Link>
                    <Link className="inline-flex items-center gap-2 font-plex text-[10px] uppercase tracking-[0.12em] text-muted transition-colors duration-180 hover:text-ink" to="/">
                        <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" /> Back to site
                    </Link>
                </header>

                <main className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-12">
                    <div className="flex items-center gap-[9px] font-plex text-[10px] uppercase tracking-[0.1em] text-muted">
                        <span className="inline-block size-[7px] bg-signal"></span> {eyebrow}
                    </div>
                    <h1 className="mt-5 font-editorial text-[length:clamp(44px,5vw,64px)] leading-[0.98] tracking-[-0.02em]">{title}</h1>
                    <p className="mt-4 text-[15.5px] leading-[1.6] text-ink/70">{intro}</p>
                    <div className="mt-9">{children}</div>
                    <p className="mt-8 text-[14px] text-ink/70">{footer}</p>
                </main>

                <p className="font-plex text-[9px] uppercase tracking-[0.1em] text-muted">© 2025 Code Harbor</p>
            </div>

            <aside className="relative p-4 max-[980px]:hidden">
                <div className="sticky top-4 h-[calc(100vh-32px)] min-h-[560px] overflow-hidden rounded-[26px] bg-[#05071c] text-paper">
                    <div className="absolute inset-0">
                        <HarborNight />
                    </div>
                    <div className="absolute inset-0 bg-linear-to-t from-[#05071c] via-[#05071c]/30 via-40% to-transparent"></div>
                    <div className="absolute inset-x-0 bottom-0 p-[clamp(28px,4vw,52px)]">
                        <h2 className="max-w-[min(380px,58%)] font-editorial text-[length:clamp(34px,3.4vw,48px)] leading-[1.02] tracking-[-0.01em]">{artTitle}</h2>
                        <p className="mt-4 max-w-[min(380px,62%)] text-[15px] leading-[1.6] text-paper/75">{artText}</p>
                        {artPoints.length > 0 && (
                            <ul className="mt-7 flex flex-wrap gap-2.5">
                                {artPoints.map((point) => (
                                    <li className="rounded-full border border-paper/25 bg-ink/40 px-3.5 py-2 font-plex text-[10px] uppercase tracking-[0.12em] text-paper backdrop-blur-md" key={point}>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </aside>
        </div>
    );
}
