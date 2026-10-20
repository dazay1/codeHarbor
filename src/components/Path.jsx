import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { Search, ArrowUpRight } from 'lucide-react';
const courses = [
    { id: 'python', number: '01', title: 'Python', text: 'Learn programming fundamentals such as variables, control flow, and loops.', level: 'Beginner', tags: ['popular', 'data', 'cs'] },
    { id: 'html', number: '02', title: 'HTML', text: 'Create your first website with HTML, the building blocks of the web.', level: 'Beginner', tags: ['popular', 'web'] },
    { id: 'css', number: '03', title: 'CSS', text: 'Use selectors, layout, and color to style your pages and make them yours.', level: 'Beginner', tags: ['popular', 'web'] },
    { id: 'javascript', number: '04', title: 'JavaScript', text: 'Learn variables, loops, functions, and events to build interactive websites.', level: 'Beginner', tags: ['popular', 'web', 'cs'] },
    { id: 'sql', number: '05', title: 'SQL', text: 'Learn database basics, queries, and calculations to start working with data.', level: 'Beginner', tags: ['popular', 'data'] },
    { id: 'git', number: '06', title: 'Git & GitHub', text: 'Save your work, try ideas on branches, and collaborate without fear.', level: 'Intermediate', tags: ['popular', 'cs'] },
];

const courseFilters = [
    ['popular', 'Popular'],
    ['web', 'Web Development'],
    ['data', 'Data Science'],
    ['cs', 'Computer Science'],
];

const still = 'motion-reduce:animate-none';
const revealBase = 'opacity-0 transition-[opacity,translate] duration-[760ms] ease-harbor motion-reduce:translate-none motion-reduce:opacity-100 [&.is-visible]:translate-none [&.is-visible]:opacity-100';
const reveal = `${revealBase} translate-y-7`;

const courseSpans = (count) =>
    ({
        1: ['col-span-6'],
        2: ['col-span-3', 'col-span-3'],
        3: ['col-span-2', 'col-span-2', 'col-span-2'],
        4: ['col-span-4', 'col-span-2', 'col-span-2', 'col-span-4'],
        5: ['col-span-4', 'col-span-2', 'col-span-2', 'col-span-2', 'col-span-2'],
    })[count] || ['col-span-4', 'col-span-2', 'col-span-2', 'col-span-4', 'col-span-3', 'col-span-3'];

function Scene({ id, sky, children }) {
    return (
        <svg className="block size-full" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <defs>
                <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
                    {sky.map(([offset, color]) => (
                        <stop offset={offset} stopColor={color} key={offset} />
                    ))}
                </linearGradient>
                <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="5" />
                </filter>
                <filter id={`${id}-haze`} x="-40%" y="-80%" width="180%" height="260%">
                    <feGaussianBlur stdDeviation="11" />
                </filter>
                <filter id={`${id}-grain`}>
                    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.9 0 0 0 -0.35" />
                </filter>
            </defs>
            <rect width="400" height="220" fill={`url(#${id}-sky)`} />
            {children}
            <rect width="400" height="220" filter={`url(#${id}-grain)`} opacity="0.1" />
        </svg>
    );
}
function ridge({ y, amp = 8, freq = 0.02, phase = 0, rough = 0, step = 10, seed = 1 }) {
    const pts = [];
    for (let x = -step; x <= 400 + step; x += step) {
        pts.push([x, y + amp * Math.sin(x * freq + phase) + amp * 0.5 * Math.sin(x * freq * 2.3 + phase * 1.7) + rough * (noise(x, seed) - 0.5) * 2]);
    }
    let d = `M${pts[0][0]} ${r1(pts[0][1])}`;
    for (let i = 1; i < pts.length - 1; i++) {
        d += ` Q${pts[i][0]} ${r1(pts[i][1])} ${(pts[i][0] + pts[i + 1][0]) / 2} ${r1((pts[i][1] + pts[i + 1][1]) / 2)}`;
    }
    return `${d} L${400 + step} 220 L${-step} 220Z`;
}
const noise = (x, seed) => {
    const v = Math.sin(x * 12.9898 + seed * 78.233) * 43758.5453;
    return v - Math.floor(v);
};
const r1 = (n) => Math.round(n * 10) / 10;

function Pine({ x, y, h, fill }) {
    return (
        <g fill={fill}>
            <polygon points={`${x},${y - h} ${x + h * 0.16},${y - h * 0.58} ${x - h * 0.16},${y - h * 0.58}`} />
            <polygon points={`${x},${y - h * 0.8} ${x + h * 0.22},${y - h * 0.3} ${x - h * 0.22},${y - h * 0.3}`} />
            <polygon points={`${x},${y - h * 0.55} ${x + h * 0.28},${y} ${x - h * 0.28},${y}`} />
        </g>
    );
}
const fromBase = { transformBox: 'fill-box', transformOrigin: '50% 100%' };

function Stars({ count, seed, maxY }) {
    return (
        <g fill="#ffffff">
            {Array.from({ length: count }, (_, i) => (
                <circle
                    className={i % 4 === 0 ? `animate-twinkle ${still}` : undefined}
                    style={i % 4 === 0 ? { animationDelay: `${-noise(i, seed + 3) * 3}s` } : undefined}
                    cx={r1(noise(i, seed) * 400)}
                    cy={r1(noise(i, seed + 1) * maxY)}
                    r={r1(0.4 + noise(i, seed + 2) * 0.8)}
                    opacity={r1(0.35 + noise(i, seed + 4) * 0.65)}
                    key={i}
                />
            ))}
        </g>
    );
}
const scenes = {
    // Python: a rainforest valley at dawn, light breaking through the mist
    python: (
        <Scene id="py" sky={[[0, '#0b3440'], [0.42, '#2c7f72'], [0.78, '#e6d39b'], [1, '#f7e9bd']]}>
            <circle cx="262" cy="74" r="70" fill="#fff3c4" opacity="0.75" filter="url(#py-haze)" />
            <circle cx="262" cy="74" r="9" fill="#fffbe6" />
            <g className={`animate-twinkle ${still}`} style={{ animationDuration: '9s' }} fill="#fff3c4" opacity="0.16" filter="url(#py-soft)">
                <polygon points="262,74 40,220 110,220" />
                <polygon points="262,74 150,220 200,220" />
                <polygon points="262,74 250,220 300,220" />
                <polygon points="262,74 350,220 400,200" />
            </g>
            <path d={ridge({ y: 104, amp: 12, freq: 0.022, phase: 0.6, rough: 3, step: 8, seed: 2 })} fill="#8fbfa8" opacity="0.75" />
            <ellipse className={`animate-drift ${still}`} cx="170" cy="120" rx="240" ry="9" fill="#ffffff" opacity="0.4" filter="url(#py-haze)" />
            <path d={ridge({ y: 122, amp: 10, freq: 0.028, phase: 2.1, rough: 4, step: 7, seed: 5 })} fill="#5a9c88" />
            <rect x="203.5" y="118" width="2" height="34" fill="#ffffff" opacity="0.65" />
            <rect className={`animate-twinkle ${still}`} x="204" y="118" width="1" height="34" fill="#d9fbff" />
            <ellipse cx="204" cy="152" rx="16" ry="4" fill="#ffffff" opacity="0.7" filter="url(#py-soft)" />
            <ellipse className={`animate-drift ${still}`} style={{ animationDelay: '-5s' }} cx="230" cy="144" rx="230" ry="8" fill="#ffffff" opacity="0.32" filter="url(#py-haze)" />
            <path d={ridge({ y: 146, amp: 9, freq: 0.03, phase: 4, rough: 5, step: 6, seed: 9 })} fill="#2f7566" />
            <path d={ridge({ y: 164, amp: 8, freq: 0.034, phase: 1.2, rough: 6, step: 6, seed: 13 })} fill="#1a564b" />
            <ellipse cx="200" cy="170" rx="220" ry="6" fill="#bfe8d6" opacity="0.2" filter="url(#py-haze)" />
            <path d={ridge({ y: 184, amp: 7, freq: 0.04, phase: 3.3, rough: 7, step: 5, seed: 17 })} fill="#0d3a33" />
            <path d={ridge({ y: 204, amp: 6, freq: 0.05, phase: 0.4, rough: 8, step: 5, seed: 21 })} fill="#061f1c" />
            <g fill="#051a17">
                <path d="M-6 -4 Q70 6 124 64 Q64 34 -6 30Z" />
                <path d="M-6 20 Q54 40 86 96 Q40 64 -6 56Z" />
                <path d="M-6 -6 Q40 -2 150 20 Q70 16 -6 12Z" />
                <path d="M406 -4 Q340 10 300 58 Q352 30 406 28Z" />
                <path d="M406 22 Q360 42 338 86 Q372 58 406 54Z" />
            </g>
            <g className={`animate-drift ${still}`} style={{ animationDuration: '14s' }} fill="none" stroke="#0d3a33" strokeWidth="1" strokeLinecap="round">
                <path d="M150 58 q3 -4 6 0 q3 -4 6 0 M172 48 q2.5 -3 5 0 q2.5 -3 5 0 M186 64 q2 -3 4 0 q2 -3 4 0" />
            </g>
            {[[92, 168], [128, 186], [300, 176], [336, 196], [246, 160]].map(([cx, cy], i) => (
                <circle className={`animate-twinkle ${still}`} style={{ animationDelay: `${-i * 0.6}s` }} cx={cx} cy={cy} r="1.2" fill="#ffe9a0" key={cx} />
            ))}
        </Scene>
    ),

    // HTML: the sun setting through a sandstone arch, the oldest structure there is
    html: (
        <Scene id="ht" sky={[[0, '#241a4e'], [0.38, '#8f3f6c'], [0.72, '#f08f58'], [1, '#ffd8a0']]}>
            <Stars count={26} seed={4} maxY={70} />
            <g className={`animate-drift ${still}`} style={{ animationDuration: '18s' }} filter="url(#ht-soft)" opacity="0.55">
                <ellipse cx="110" cy="62" rx="70" ry="4" fill="#ffb08a" />
                <ellipse cx="300" cy="46" rx="60" ry="3.5" fill="#f08fa0" />
                <ellipse cx="230" cy="84" rx="90" ry="4" fill="#ffc890" />
            </g>
            <circle cx="198" cy="142" r="64" fill="#ffe2a8" opacity="0.8" filter="url(#ht-haze)" />
            <circle cx="198" cy="142" r="15" fill="#fff1cf" />
            <path d="M-10 150 V118 H40 L46 128 H92 L98 112 H150 L156 132 H250 L256 108 H318 L324 126 H372 L378 116 H410 V150Z" fill="#c9675c" opacity="0.8" />
            <path d="M-10 160 V134 H26 L32 146 H70 V160Z M300 160 V138 L306 128 H350 L356 140 H410 V160Z" fill="#a4475a" />
            <ellipse cx="200" cy="158" rx="240" ry="7" fill="#ffc890" opacity="0.5" filter="url(#ht-haze)" />
            <path d="M-10 220 V158 H410 V220Z" fill="#5a2244" />
            <path d="M198 160 Q186 176 204 188 Q226 200 196 220 H236 Q250 200 222 186 Q204 176 206 160Z" fill="#ffb880" opacity="0.55" />
            <path
                fillRule="evenodd"
                d="M62 220 V160 Q56 118 92 100 Q146 74 214 80 Q276 84 306 108 Q334 132 328 178 V220Z M124 220 V172 Q120 132 170 120 Q232 108 262 138 Q280 158 274 220Z"
                fill="#2a1030"
            />
            <path d="M124 220 V172 Q120 132 170 120 Q232 108 262 138 Q280 158 274 220" fill="none" stroke="#ffb070" strokeWidth="1.4" opacity="0.75" />
            <g stroke="#ff9c70" strokeWidth="0.8" opacity="0.22" fill="none">
                <path d="M64 150 Q92 146 122 150 M276 150 Q300 146 326 152 M84 112 Q196 92 312 116 M62 182 Q92 178 124 182 M276 184 Q300 180 328 186 M104 100 Q200 84 296 104" />
            </g>
            <path d={ridge({ y: 208, amp: 4, freq: 0.05, phase: 1, rough: 3, step: 8, seed: 3 })} fill="#170818" />
            <path d="M20 220 V186 Q22 178 30 178 H44 Q52 178 54 186 V220Z M352 220 V192 Q354 184 362 184 H378 Q386 184 388 192 V220Z" fill="#170818" />
            <g className={`animate-drift ${still}`} style={{ animationDuration: '14s' }} fill="none" stroke="#2a1030" strokeWidth="1" strokeLinecap="round">
                <path d="M168 108 q3 -4 6 0 q3 -4 6 0 M222 100 q2.5 -3 5 0 q2.5 -3 5 0" />
            </g>
        </Scene>
    ),

    // CSS: dusk colour over lavender fields running to the horizon
    css: (
        <Scene id="cs" sky={[[0, '#1b2466'], [0.34, '#7558bd'], [0.62, '#ee8cae'], [0.84, '#ffc38a'], [1, '#ffe4b4']]}>
            <Stars count={22} seed={8} maxY={56} />
            <g className={`animate-drift ${still}`} style={{ animationDuration: '20s' }} filter="url(#cs-soft)" opacity="0.6">
                <ellipse cx="96" cy="70" rx="80" ry="4" fill="#ffb3c8" />
                <ellipse cx="290" cy="56" rx="72" ry="3.5" fill="#c9a0ff" />
                <ellipse cx="210" cy="94" rx="100" ry="4" fill="#ffd2a0" />
                <ellipse cx="60" cy="102" rx="60" ry="3" fill="#ffc2b0" />
            </g>
            <circle cx="200" cy="134" r="62" fill="#fff0c4" opacity="0.85" filter="url(#cs-haze)" />
            <circle cx="200" cy="134" r="16" fill="#fff6dc" />
            <path d={ridge({ y: 128, amp: 7, freq: 0.016, phase: 1.4 })} fill="#8a6cc4" opacity="0.8" />
            <path d={ridge({ y: 134, amp: 5, freq: 0.024, phase: 3.2 })} fill="#5d489c" />
            <g fill="#2c2060">
                <rect x="70" y="124" width="14" height="10" />
                <polygon points="67,125 77,117 87,125" />
                <path d="M300 136 q-3 -14 0 -26 q3 12 0 26Z M312 136 q-4 -18 0 -34 q4 16 0 34Z M324 136 q-3 -12 0 -22 q3 10 0 22Z M104 136 q-3 -12 0 -20 q3 8 0 20Z" />
            </g>
            <rect className={`animate-twinkle ${still}`} x="75" y="127" width="3" height="3" fill="#ffe2a0" />
            <rect x="-10" y="138" width="420" height="82" fill="#3a2a80" />
            <g>
                {Array.from({ length: 22 }, (_, i) => {
                    const a = 200 + (i - 11) * 46;
                    const b = 200 + (i - 10) * 46;
                    return <polygon points={`200,136 ${a},222 ${b},222`} fill={i % 2 ? '#8f68dc' : '#5b3fae'} key={i} />;
                })}
            </g>
            <rect x="-10" y="136" width="420" height="86" fill="url(#cs-fade)" />
            <defs>
                <linearGradient id="cs-fade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffb7a0" stopOpacity="0.65" />
                    <stop offset="0.3" stopColor="#7a54c8" stopOpacity="0.15" />
                    <stop offset="1" stopColor="#120a3a" stopOpacity="0.75" />
                </linearGradient>
            </defs>
            <ellipse className={`animate-drift ${still}`} cx="190" cy="140" rx="240" ry="6" fill="#ffd9c0" opacity="0.55" filter="url(#cs-haze)" />
            {[[60, 176], [118, 196], [280, 184], [338, 170], [222, 204], [160, 162]].map(([cx, cy], i) => (
                <circle className={`animate-twinkle ${still}`} style={{ animationDelay: `${-i * 0.5}s` }} cx={cx} cy={cy} r="1.2" fill="#fff0b0" key={cx} />
            ))}
        </Scene>
    ),

    // JavaScript: last light on an alpine lake
    javascript: (
        <Scene id="js" sky={[[0, '#10164a'], [0.42, '#56387f'], [0.74, '#e0746a'], [1, '#ffc47c']]}>
            <Stars count={30} seed={12} maxY={72} />
            <circle cx="132" cy="132" r="80" fill="#ffd08a" opacity="0.8" filter="url(#js-haze)" />
            <g className={`animate-drift ${still}`} style={{ animationDuration: '18s' }} filter="url(#js-soft)" opacity="0.55">
                <ellipse cx="300" cy="64" rx="70" ry="4" fill="#f09a9a" />
                <ellipse cx="90" cy="84" rx="64" ry="3.5" fill="#ffc090" />
            </g>
            <polygon points="-10,150 30,118 58,132 96,92 130,126 160,104 190,128 226,96 262,130 300,102 340,134 372,112 410,128 410,150" fill="#9a6fa8" opacity="0.7" />
            <polygon points="60,150 118,96 140,110 176,62 200,42 222,70 246,58 282,108 304,98 350,150" fill="#4f4086" />
            <polygon points="200,42 222,70 246,58 282,108 304,98 350,150 226,150 214,96" fill="#221a56" opacity="0.5" />
            <polygon points="200,42 214,62 207,70 200,60 193,78 185,66 176,62 188,52" fill="#ffd9c2" />
            <polygon points="246,58 257,74 250,78 245,71 240,80 236,68" fill="#f3c4b8" />
            <polygon points="118,96 128,106 122,110 116,105 110,112 108,104" fill="#f3c4b8" />
            <path d={ridge({ y: 146, amp: 4, freq: 0.03, phase: 2, rough: 4, step: 5, seed: 6 })} fill="#241d55" />
            <rect x="-10" y="152" width="420" height="68" fill="url(#js-lake)" />
            <defs>
                <linearGradient id="js-lake" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#f08a70" />
                    <stop offset="0.45" stopColor="#5a3a82" />
                    <stop offset="1" stopColor="#0c1038" />
                </linearGradient>
                <clipPath id="js-water">
                    <rect x="-10" y="152" width="420" height="68" />
                </clipPath>
            </defs>
            <g clipPath="url(#js-water)" opacity="0.4" filter="url(#js-soft)">
                <polygon points="60,154 118,208 140,194 176,242 200,262 222,234 246,246 282,196 304,206 350,154" fill="#2c2466" />
            </g>
            <ellipse cx="132" cy="160" rx="70" ry="5" fill="#ffd9a0" opacity="0.7" filter="url(#js-soft)" />
            <g className={`animate-twinkle ${still}`} fill="#ffe2b0">
                <rect x="112" y="166" width="40" height="1.2" opacity="0.8" />
                <rect x="104" y="174" width="56" height="1.2" opacity="0.6" />
                <rect x="118" y="183" width="28" height="1.2" opacity="0.5" />
                <rect x="108" y="193" width="46" height="1.2" opacity="0.35" />
            </g>
            <ellipse className={`animate-drift ${still}`} cx="210" cy="154" rx="240" ry="5" fill="#ffd9c8" opacity="0.5" filter="url(#js-haze)" />
            <path d="M-10 220 V178 Q30 170 66 182 Q92 192 100 220Z M410 220 V174 Q366 166 326 182 Q300 194 292 220Z" fill="#080a24" />
            {[[12, 184, 56], [30, 188, 40], [48, 190, 64], [70, 196, 34], [388, 180, 60], [368, 186, 44], [346, 190, 68], [322, 198, 36]].map(([x, y, h]) => (
                <Pine x={x} y={y} h={h} fill="#080a24" key={x} />
            ))}
        </Scene>
    ),

    // SQL: the deep, where everything is stored
    sql: (
        <Scene id="sq" sky={[[0, '#3a9cc4'], [0.3, '#125a94'], [0.7, '#08265a'], [1, '#030a26']]}>
            <ellipse cx="190" cy="-6" rx="170" ry="26" fill="#d6f6ff" opacity="0.7" filter="url(#sq-haze)" />
            <g className={`animate-twinkle ${still}`} style={{ animationDuration: '8s' }} fill="#d6f6ff" opacity="0.16" filter="url(#sq-soft)">
                <polygon points="110,-4 150,-4 96,220 20,220" />
                <polygon points="186,-4 214,-4 220,220 164,220" />
                <polygon points="250,-4 290,-4 372,220 300,220" />
            </g>
            <g className={`animate-drift ${still}`} style={{ animationDuration: '26s' }} fill="#0a3566" opacity="0.8">
                <path d="M146 84 Q190 60 244 74 Q264 79 280 66 Q277 80 290 90 Q272 88 258 92 Q212 108 168 98 Q152 95 146 84Z" />
                <path d="M204 99 q5 13 18 15 q-7 -8 -5 -17Z" />
            </g>
            <g className={`animate-drift ${still}`} style={{ animationDuration: '12s' }} fill="#bfe6ff" opacity="0.75">
                {Array.from({ length: 34 }, (_, i) => {
                    const t = i / 34;
                    const x = 60 + t * 110 + noise(i, 3) * 14;
                    const y = 120 + Math.sin(t * 6.2) * 16 + noise(i, 7) * 10;
                    return <ellipse cx={r1(x)} cy={r1(y)} rx="2.6" ry="0.8" transform={`rotate(${r1(Math.cos(t * 6.2) * 22)} ${r1(x)} ${r1(y)})`} key={i} />;
                })}
            </g>
            <path d={ridge({ y: 170, amp: 12, freq: 0.026, phase: 0.8, rough: 6, step: 7, seed: 4 })} fill="#0b3668" opacity="0.8" />
            <path d={ridge({ y: 186, amp: 9, freq: 0.034, phase: 2.6, rough: 7, step: 6, seed: 8 })} fill="#062450" />
            <g fill="none" strokeLinecap="round" stroke="#03183a" strokeWidth="4">
                {[[24, 96, 0], [42, 70, -1.2], [60, 54, -2.4], [348, 104, -0.6], [366, 76, -1.8], [384, 58, -3]].map(([x, h, delay]) => (
                    <path
                        className={`animate-sway ${still}`}
                        style={{ ...fromBase, animationDelay: `${delay}s`, animationDuration: '5s' }}
                        d={`M${x} 220 q-7 ${-h / 4} 0 ${-h / 2} t0 ${-h / 2}`}
                        key={x}
                    />
                ))}
            </g>
            <g fill="none" stroke="#03183a" strokeWidth="3" strokeLinecap="round">
                <path d="M120 206 v-18 M120 196 q-9 -4 -11 -16 M120 194 q9 -5 11 -18 M120 188 q0 -8 -4 -14" />
                <path d="M286 204 v-16 M286 194 q-8 -4 -10 -14 M286 192 q8 -5 10 -16" />
            </g>
            <path d={ridge({ y: 204, amp: 6, freq: 0.045, phase: 4.1, rough: 6, step: 6, seed: 12 })} fill="#020e28" />
            {[[100, 180], [150, 196], [214, 188], [262, 200], [310, 182], [180, 176]].map(([cx, cy], i) => (
                <circle className={`animate-twinkle ${still}`} style={{ animationDelay: `${-i * 0.5}s` }} cx={cx} cy={cy} r="1.3" fill="#6ff2e0" key={cx} />
            ))}
            <g fill="#d6f6ff" opacity="0.6">
                {[[80, 150, 0], [168, 164, -2], [236, 140, -4], [300, 158, -1], [130, 132, -3], [330, 126, -5]].map(([cx, cy, delay]) => (
                    <circle className={`animate-rise ${still}`} style={{ animationDelay: `${delay}s`, animationDuration: '9s' }} cx={cx} cy={cy} r="0.9" key={cx} />
                ))}
            </g>
        </Scene>
    ),

    // Git: northern lights branching across a winter sky
    git: (
        <Scene id="gt" sky={[[0, '#030518'], [0.6, '#0b1746'], [1, '#1a2c70']]}>
            <Stars count={46} seed={16} maxY={120} />
            <g filter="url(#gt-haze)" fill="none" strokeLinecap="round">
                <path className={`animate-twinkle ${still}`} style={{ animationDuration: '9s' }} d="M-20 98 Q70 26 150 70 T290 52 T430 78" stroke="#3dffb0" strokeWidth="22" opacity="0.8" />
                <path className={`animate-twinkle ${still}`} style={{ animationDuration: '11s', animationDelay: '-4s' }} d="M-20 118 Q90 62 180 98 T430 88" stroke="#35c9f0" strokeWidth="14" opacity="0.6" />
                <path className={`animate-twinkle ${still}`} style={{ animationDuration: '10s', animationDelay: '-6s' }} d="M40 50 Q150 6 250 36 T430 32" stroke="#a48bff" strokeWidth="14" opacity="0.6" />
            </g>
            <g stroke="#c8ffe8" strokeWidth="0.8" opacity="0.2" filter="url(#gt-soft)">
                <path d="M60 34 v54 M90 26 v60 M124 34 v48 M160 48 v44 M200 54 v40 M240 42 v46 M280 36 v46 M320 44 v44 M352 52 v40" />
            </g>
            <circle cx="330" cy="40" r="26" fill="#fff6d6" opacity="0.5" filter="url(#gt-haze)" />
            <circle cx="330" cy="40" r="7" fill="#fff8e2" />
            <polygon points="-10,160 40,100 70,124 118,70 150,112 188,86 226,126 268,78 310,122 350,96 410,132 410,160" fill="#1d2b6a" />
            <polygon points="118,70 150,112 188,86 226,126 268,78 300,112 250,160 150,160" fill="#0c1440" opacity="0.45" />
            <polygon points="118,70 130,86 124,92 118,84 111,96 104,88" fill="#cfdcff" />
            <polygon points="268,78 280,94 274,100 268,92 261,104 254,96" fill="#cfdcff" />
            <polygon points="188,86 196,98 191,102 187,96 182,104 178,98" fill="#aebfee" />
            <path d={ridge({ y: 152, amp: 6, freq: 0.026, phase: 1.3, rough: 5, step: 5, seed: 7 })} fill="#0d1746" />
            <path d="M96 176 Q200 160 304 176 Q330 190 200 196 Q70 190 96 176Z" fill="#16286a" />
            <path d="M120 180 Q200 170 280 182" stroke="#3dffb0" strokeWidth="6" fill="none" opacity="0.55" filter="url(#gt-soft)" />
            <path d="M140 186 Q200 180 262 188" stroke="#a48bff" strokeWidth="3" fill="none" opacity="0.4" filter="url(#gt-soft)" />
            <path d="M-10 186 Q50 168 100 178 Q84 190 112 198 Q200 206 290 198 Q316 190 300 178 Q350 168 410 182 V220 H-10Z" fill="url(#gt-snow)" />
            <defs>
                <linearGradient id="gt-snow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#c6d6ff" />
                    <stop offset="1" stopColor="#4a5fa8" />
                </linearGradient>
            </defs>
            {[[16, 190, 70], [38, 194, 50], [60, 198, 36], [384, 186, 76], [362, 192, 52], [338, 198, 38]].map(([x, y, h]) => (
                <Pine x={x} y={y} h={h} fill="#050a26" key={x} />
            ))}
        </Scene>
    ),
};

function Path({ pad, eyebrow, eyebrowDot, btn }) {
    const [courseFilter, setCourseFilter] = useState('popular');
    const [courseQuery, setCourseQuery] = useState('')

    // Cards wait until the grid scrolls into view, then rise in one after another.
    const gridRef = useRef(null);
    const [gridInView, setGridInView] = useState(false);
    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setGridInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '0px 0px -12% 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const searching = courseQuery.trim() !== '';
    const visibleCourses = courses.filter((course) =>
        searching
            ? `${course.title} ${course.text}`.toLowerCase().includes(courseQuery.trim().toLowerCase())
            : course.tags.includes(courseFilter)
    );
    return (
        <section className={`relative overflow-hidden border-t border-line-light bg-[#0a0b10] py-[130px] text-paper max-[720px]:py-20 ${pad}`} id="paths">
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                <div className="absolute -top-[240px] left-[8%] size-[520px] rounded-full bg-signal/10 blur-[140px]"></div>
                <div className="absolute -top-[200px] right-[4%] size-[460px] rounded-full bg-[#6f5bd6]/15 blur-[140px]"></div>
            </div>

            <div className="relative mx-auto max-w-[1200px]">
                <div className={`flex items-end justify-between gap-x-16 gap-y-8 max-[980px]:flex-col max-[980px]:items-start ${reveal}`} data-reveal>
                    <div>
                        <div className={`${eyebrow} text-paper/70`}>
                            <span className={eyebrowDot}></span> Choose your route
                        </div>
                        <h2 className="mt-6 text-[length:clamp(44px,5.6vw,84px)] font-medium leading-[0.96] tracking-[-0.06em]">
                            Every builder
                            <br />
                            <em className="font-editorial font-normal tracking-[-0.02em] text-signal">starts somewhere.</em>
                        </h2>
                    </div>
                    <div className="max-w-[340px] pb-2">
                        <p className="text-[15px] leading-[1.65] text-paper/70">
                            Interactive courses you practice right in the browser. Not sure where to begin? Follow the one that feels most like you.
                        </p>
                        <div className="mt-5 flex items-center gap-3 font-plex text-[10px] uppercase tracking-[0.16em] text-paper/60">
                            <span className="h-px w-8 bg-paper/40"></span>
                            {String(courses.length).padStart(2, '0')} courses
                        </div>
                    </div>
                </div>

                <div className={`mt-16 flex flex-wrap items-center justify-between gap-x-8 border-b border-paper/15 ${reveal}`} data-reveal>
                    <div className="flex flex-wrap gap-x-8">
                        {courseFilters.map(([key, label]) => {
                            const active = !searching && courseFilter === key;
                            return (
                                <button
                                    className={`relative h-12 cursor-pointer text-[14px] tracking-[-0.01em] transition-colors duration-180 after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:origin-left after:bg-signal after:transition-transform after:duration-300 ${active ? 'text-paper after:scale-x-100' : 'text-paper/60 after:scale-x-0 hover:text-paper'}`}
                                    type="button"
                                    aria-pressed={active}
                                    key={key}
                                    onClick={() => {
                                        setCourseFilter(key);
                                        setCourseQuery('');
                                    }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                    <label className="flex h-12 items-center gap-2.5 text-paper/60 transition-colors duration-180 focus-within:text-paper max-[720px]:w-full">
                        <Search size={15} className="flex-none" aria-hidden="true" />
                        <span className="sr-only">Search courses</span>
                        <input
                            className="w-[170px] min-w-0 bg-transparent text-[14px] text-paper outline-none placeholder:text-paper/55 max-[720px]:w-full"
                            type="search"
                            placeholder="Search courses"
                            value={courseQuery}
                            onChange={(e) => setCourseQuery(e.target.value)}
                        />
                    </label>
                </div>

                <div className="mt-8 grid grid-cols-6 gap-5" ref={gridRef}>
                    {visibleCourses.map((course, i) => (
                        <Link
                            className={`group relative isolate flex min-h-[400px] flex-col justify-end overflow-hidden bg-ink-soft max-[980px]:col-span-3 max-[720px]:col-span-6 max-[720px]:min-h-[360px] ${gridInView ? 'animate-card-in motion-reduce:animate-none' : 'opacity-0'} ${courseSpans(visibleCourses.length)[i]}`}
                            style={{ animationDelay: `${i * 110}ms` }}
                            to={`/course/${course.id}`}
                            // Keyed by the active filter so switching tabs replays the entrance.
                            key={`${searching ? 'search' : courseFilter}:${course.id}`}
                        >
                            <div className="absolute inset-0 -z-10 transition-transform duration-[1400ms] ease-harbor group-hover:scale-[1.06]">{scenes[course.id]}</div>
                            <div className="absolute inset-0 -z-10 bg-linear-to-t from-[#06070b] via-[#06070b]/55 via-45% to-transparent transition-opacity duration-500 group-hover:opacity-85"></div>
                            <div className="pointer-events-none absolute inset-0 border border-paper/10 transition-colors duration-500 group-hover:border-paper/35"></div>

                            <div className="absolute inset-x-6 top-6 flex items-center justify-between">
                                <span className="font-plex text-[11px] tracking-[0.14em] text-paper/85">{course.number}</span>
                                <span className="border border-paper/25 bg-ink/40 px-2.5 py-1.5 font-plex text-[10px] uppercase leading-none tracking-[0.14em] text-paper backdrop-blur-md">
                                    {course.level}
                                </span>
                            </div>

                            <div className="p-6 pt-24">
                                <h3 className="font-editorial text-[44px] leading-[0.95] tracking-[-0.01em]">{course.title}</h3>
                                <p className="mt-3 max-w-[360px] text-[14px] leading-[1.55] text-paper/80">{course.text}</p>
                                <div className="mt-6 flex items-center justify-between border-t border-paper/15 pt-4">
                                    <span className="font-plex text-[10px] uppercase tracking-[0.16em] text-paper/75 transition-colors duration-300 group-hover:text-signal">Start course</span>
                                    <span className="flex size-10 items-center justify-center rounded-full border border-paper/30 transition duration-300 group-hover:border-signal group-hover:bg-signal group-hover:text-ink">
                                        <ArrowUpRight size={17} strokeWidth={1.8} aria-hidden="true" />
                                    </span>
                                </div>
                            </div>
                            <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-signal transition-transform duration-500 ease-harbor group-hover:scale-x-100"></div>
                        </Link>
                    ))}
                </div>

                {visibleCourses.length === 0 && (
                    <p className="border border-dashed border-paper/25 py-16 text-center font-plex text-[12px] uppercase tracking-[0.1em] text-paper/70">
                        No courses match “{courseQuery.trim()}” yet
                    </p>
                )}

                <div className="mt-14 flex justify-center">
                    <a className={`${btn} min-h-[54px] border-paper/30 px-7 text-paper hover:border-signal hover:bg-signal hover:text-ink`} href="#final-cta">
                        Explore all courses <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    )
}

// The course list and artwork are reused by the course and lesson pages.
export { courses, scenes };

export default Path