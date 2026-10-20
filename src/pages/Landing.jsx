import { useState, useEffect, useRef, useCallback } from "react";
import { Sprite, CircuitTrace } from '../components/PixelComponents';

const WORLDS = [
    {
        id: "html", name: "HTML Hills", level: "Easy", lessons: 24, xp: 480, desc: "Build the skeleton of every web page.",
        boss: "The Missing Tag", land: "html"
    },
    {
        id: "css", name: "CSS Coast", level: "Easy", lessons: 28, xp: 560, desc: "Paint pages with colour, space and motion.",
        boss: "The Overflow Ogre", land: "css"
    },
    {
        id: "js", name: "Javascript Jungle", level: "Medium", lessons: 40, xp: 900, desc: "Bring pages to life with logic and events.", boss: "The Infinite Loop", land: "js"
    },
    {
        id: "py", name: "Python Peaks", level: "Medium", lessons: 36, xp: 800, desc: "Climb with clean code, data and automation.", boss: "The Indent Imp", land: "py"
    },
];

const QUEST_STEPS = [
    {
        num: "01", icon: "book", title: "Learn", desc: "A short explanation with one exmaple, in Uzbek with English terms beside it.", min: "3 min"
    },
    {
        num: "02", icon: "term", title: "Code", desc: "Edit real code in the browser and watch it run. Nothing to install.", min: "10 min"
    },
    {
        num: "03", icon: "bug", title: "Beat the bug", desc: "Fix broken code to defeat a boss. A mistake costs a heart, never your progress.", min: "8 min"
    },
    {
        num: "04", icon: "trophy", title: "Level up", desc: "Collect XP, a badge and another streak day. Old topics return when you need them.", min: "4 min"
    },
]

const BUG_OPTIONS = [
    {
        text: 'Change <code class="font-mono text-[var(--code-fg)] bg-[var(--code-bg)] px-1.5 py-0.5">nme</code> to <code class="font-mono text-[var(--code-fg)] bg-[var(--code-bg)] px-1.5 py-0.5">name</code>',
        ok: true,
        out: ["Salom, Dilnoza", "Direct hit! Python names must match exactly, so <code class=\"font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1 \">nme</code> and <code class=\"font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1\">name</code> are different words."]
    },
    {
        text: 'Remove the quotes around <code class="font-mono text-[var(--code-fg)] bg-[var(--code-bg)] px-1.5 py-0.5">Salom, "</code>',
        ok: false,
        out: ["SyntaxError: invalid syntax", "Miss. Without quotes Python reads Salom as a name, not text. You lose a heart."]
    },
    {
        text: 'Delete the <code class="font-mono text-[var(--code-fg)] bg-[var(--code-bg)] px-1.5 py-0.5"> print</code> line',
        ok: false,
        out: ["(no output)", "Miss. The error is gone, but so is the greeting. You lose a heart."]
    },
]

const BADGES = [
    {
        g: "</>", c: "var(--blue)", n: "First line", d: "Run your first code", on: true
    },
    {
        g: "H1", c: "var(--coral)", n: "HTML Hero", d: "Finish HTML Hills", on: true
    },
    {
        g: "x", c: "var(--green)", n: "Bug Slayer", d: "Beat 10 bosses", on: true
    },
    {
        g: "7", c: "var(--yellow)", n: "7-day streak", d: "Code a week in a row", on: true
    },
    {
        g: "zZ", c: "var(--purple", n: "Night owl", d: "Finish a quest after 11 p.m.", on: false
    },
    {
        g: "Py", c: "var(--teal)", n: "Peak climber", d: "Finish Python Peaks", on: false
    }
];

const BOARD = [
    ["Jasur", 4120, "#FFD54A", "Gold"],
    ["Dilnoza", 3880, "#6FA8FF", "Gold"],
    ["Madina", 3410, "#FF6B8A", "Silver"],
    ["Bekzod", 3090, "#5BE37D", "Silver"],
    ["Aziza", 2760, "#9B8DFF", "Silver"],
    ["You", 1260, "#59E0D0", "Silver"],
]

const TICKER_WORDS = ["HTML", "CSS", "JAVASCRIPT", "PYTHON", "GIT", "AI TOOLS", "SCRATCH"];

const MENTOR_TABS = [
    {
        k: "hint", labe: "Hint", desc: "A nudge in the right direction. No answer given."
    },
    {
        k: "explain", label: "Explain", desc: "A nudge in the right direction. No ansewr given."
    },
    {
        k: "explaination", label: "Explain", desc: "Why it happens, in plain words, with a small example."
    },
    {
        k: "review", label: "Review", desc: "Notes on your own code: names, structure, what to improve."
    }
]

const LEAGUES = [
    { c: "#C98A4B", name: "Bronze", note: "Start" },
    { c: "#C7CCE0", name: "Silver", note: "You are here", cur: true },
    { c: "#FFD54A", name: "Gold", note: "+500 XP" },
    { c: "#59E0D0", name: "Diamond", note: "+1500 XP" },
];

function rng(seed) {
    return () => {
        seed |= 0;
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const SPRITE_DATA = {
    bit: [
        ".......oo.......", "......oyyo......", ".......oo.......", ".......oo.......",
        "..oooooooooooo..", ".oppppppppppppo.", ".opnnnnnnnnnnpo.", ".opnggnnnnggnpo.",
        ".opnggnnnnggnpo.", ".opnnnnnnnnnnpo.", ".opnngnnnngnnpo.", ".opnnnggggnnnpo.",
        ".oPPPPPPPPPPPPo.", "..oooooooooooo..", "..oyyo....oyyo..", "..oooo....oooo..",
    ],
};

const SPRITE_PAL = {
    o: "#1A1440", n: "#1A1440", w: "#FFFFFF", y: "#FFD54A", Y: "#E0A21F",
    r: "#FF6B8A", R: "#C93A5E", g: "#5BE37D", G: "#2E9E57", b: "#6FA8FF",
    B: "#3A6FD8", p: "#9B8DFF", P: "#5B4DD1", k: "#B9B3E6",
};

function drawSprite(ctx, name, x, y, s) {
    const rows = SPRITE_DATA[name];
    if (!rows) return;
    rows.forEach((r, j) => {
        for (let i = 0; i < r.length; i++) {
            const ch = r.charAt(i);
            if (ch !== ".") {
                ctx.fillStyle = SPRITE_PAL[ch];
                ctx.fillRect(x + i * s, y + j * s, s, s);
            }
        }
    });
}

function drawHero(cv, tick) {
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const W = 192, H = 120;
    ctx.clearRect(0, 0, W, H);
    const bands = [["#0A0924", 0], ["#110F3D", 26], ["#1b1658", 46], ["#2A2073", 62], ["#3B2C8F", 74]];
    bands.forEach((b, k) => {
        ctx.fillStyle = b[0];
        ctx.fillRect(0, b[1], W, (bands[k + 1] ? bands[k + 1][1] : H) - b[1]);
    });
    for (let i = 1; i < bands.length; i++) {
        ctx.fillStyle = bands[i][0];
        const y = bands[i][1];
        for (let x = 0; x < W; x += 2) { ctx.fillRect(x + 1, y - 1, 1, 1); ctx.fillRect(x, y - 2, 1, 1); }
    }
    const r = rng(7);
    for (let i = 0; i < 46; i++) {
        const x = (r() * W) | 0, y = (r() * 66) | 0, ph = (r() * 4) | 0, big = r() < 0.14;
        ctx.fillStyle = ((tick + ph) % 4 === 0) ? "#6E64D0" : "#EDEAFF";
        ctx.fillRect(x, y, 1, 1);
        if (big && (tick + ph) % 4 !== 0) { ctx.fillRect(x - 1, y, 3, 1); ctx.fillRect(x, y - 1, 1, 3); }
    }
    for (let y = -9; y <= 9; y++)
        for (let x = -9; x < 9; x++)
            if (x * x + y * y <= 81 && (x + 4) * (x + 4) + (y - 2) * (y - 2) > 64) { ctx.fillStyle = "#FFF1B8"; ctx.fillRect(156 + x, 18 + y, 1, 1); }

    const ridge = (color, base, amp, f1, f2, ph) => {
        ctx.fillStyle = color;
        for (let x = 0; x < W; x++) { const h = amp * (Math.sin(x / f1 + ph) + Math.sin(x / f2 + ph * 2) * 0.5) + amp * 1.6; ctx.fillRect(x, (base - h) | 0, 1, H); }
    };
    ridge("#2a2378", 92, 9, 17, 7, 0.3);
    ridge("#1E1960", 100, 7, 12, 5, 1.7);
    ctx.fillStyle = "#0F0D2B"; ctx.fillRect(0, 100, W, 20);
    ctx.fillStyle = "#2E9E57"; ctx.fillRect(0, 100, W, 1);
    const tr = [[0, 106, 60, 0], [40, 110, 90, 1], [110, 104, 192, 0], [80, 114, 170, 0]];
    ctx.fillStyle = '#1F6B45';
    tr.forEach((t) => { ctx.fillRect(t[0], t[1], t[2] - t[0], 1); ctx.fillRect(t[0] + ((t[2] - t[0]) / 2 | 0), t[1] - 2, 1, 3); });
    ctx.fillStyle = "#5BE37D";
    [[30, 106], [84, 110], [150, 104], [120, 114], [60, 114]].forEach((p) => ctx.fillRect(p[0], p[1] - 1, 3, 3));
    const px = (tick * 6) % 110; ctx.fillStyle = "#FFD54A";
    ctx.fillRect(px, 106, 3, 1); ctx.fillRect(192 - ((tick * 5) % 100), 104, 3, 1);
    const tower = (x, w, top, seed) => {
        const b = rng(seed);
        ctx.fillStyle = "#07061A"; ctx.fillRect(x - 1, top - 1, w + 2, 100 - top + 1);
        ctx.fillStyle = "#352D8E"; ctx.fillRect(x, top, 1, 100 - top);
        for (let wy = top + 4; wy < 96; wy += 6)
            for (let wx = x + 3; wx < x + w - 3; wx += 5) {
                let lit = b() > 0.42; if ((tick + wx + wy) % 9 === 0) lit = !lit;
                ctx.fillStyle = lit ? (b() > 0.5 ? "#FFD54A" : "#5BE37D") : "#14104A";
                ctx.fillRect(wx, wy, 3, 3);
            }
        ctx.fillStyle = "#B9B3E6"; ctx.fillRect(x + (w / 2 | 0), top - 8, 1, 8);
        ctx.fillStyle = (tick % 2) ? "#FF6B8A" : "#7A2A44";
        ctx.fillRect(x + (w / 2 | 0) - 1, top - 10, 3, 3);
    };
    tower(12, 16, 70, 3); tower(34, 26, 50, 5); tower(64, 18, 66, 9); tower(92, 16, 76, 11);
    for (let i = 0; i < 9; i++) {
        const y = 36 - ((tick * 3 + i * 5) % 38); ctx.fillStyle = i % 2 ? "#6FE8FF" : "#FFFFFF";
        ctx.fillRect(47, y + 10, 1, 2);
    }
    const hop = (tick % 4 === 0) ? 2 : 0;
    drawSprite(ctx, "bit", 128, 69 - hop, 2);
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)"; ctx.fillRect(130, 101, 28, 2);
}

function drawLand(canvas, type) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const W = 96, H = 48;
    ctx.imageSmoothingEnabled = false;
    if (type === "html") {
        ctx.fillStyle = "#8FD3FF"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#8FE8FF"; ctx.fillRect(0, 18, W, 12);
        ctx.fillStyle = "#fff";[[10, 8, 14, 3], [14, 6, 8, 2], [62, 12, 16, 3], [66, 10, 8, 2]].forEach((a) => ctx.fillRect(a[0], a[1], a[2], a[3]));
        for (let x = 0; x < W; x++) { const h = Math.sin(x / 12) * 5 - Math.sin(x / 5) * 1.5; ctx.fillStyle = "#5BE37D"; ctx.fillRect(x, (30 + h) | 0, 1, H); ctx.fillStyle = "#2E9E57"; ctx.fillRect(x, (36 + h * 1.2) | 0, 1, H); }
        ctx.fillStyle = "#1A1440"; ctx.fillRect(38, 18, 26, 22); ctx.fillStyle = "#FFF2D6"; ctx.fillRect(40, 20, 22, 20);
        ctx.fillStyle = "#FF6B8A"; ctx.fillRect(36, 14, 30, 4); ctx.fillRect(40, 10, 22, 4); ctx.fillRect(44, 6, 14, 4);
        ctx.fillStyle = "#6FA8FF"; ctx.fillRect(44, 26, 6, 6); ctx.fillStyle = "#8A5A2B"; ctx.fillRect(54, 28, 6, 12);
        ctx.fillStyle = "#1A1440"; ctx.fillRect(70, 20, 2, 16); ctx.fillStyle = "#FFD54A"; ctx.fillRect(66, 14, 10, 8); ctx.fillStyle = "#1A1440"; ctx.fillRect(68, 17, 2, 2); ctx.fillRect(72, 17, 2, 2);
    } else if (type === "css") {
        ctx.fillStyle = "#FF9EC4"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#FFB8A8"; ctx.fillRect(0, 12, W, 10); ctx.fillStyle = "#FFDBA0"; ctx.fillRect(0, 22, W, 8);
        ctx.fillStyle = "#FFD54A"; for (let y = -9; y <= 9; y++) for (let x = -9; x <= 9; x++) if (x * x + y * y <= 72) ctx.fillRect(66 + x, 24 + y, 1, 1);
        for (let k = 0; k < 5; k++) { ctx.fillStyle = k % 2 ? "#3A6FD8" : "#4F86EE"; ctx.fillRect(0, 28 + k * 5, W, 5); }
        ctx.fillStyle = "#8FB6FF"; for (let wv = 0; wv < W; wv += 8) { ctx.fillRect(wv, 30, 4, 1); ctx.fillRect(wv + 4, 36, 4, 1); ctx.fillRect(wv + 2, 42, 4, 1); }
        ctx.fillStyle = "#1A1440"; ctx.fillRect(28, 12, 2, 18); ctx.fillStyle = "#fff"; ctx.fillRect(30, 12, 8, 14); ctx.fillRect(30, 12, 12, 2); ctx.fillStyle = "#FF6B8A"; ctx.fillRect(20, 12, 8, 12);
        ctx.fillStyle = "#8A5A2B"; ctx.fillRect(20, 20, 22, 3);
    } else if (type === "js") {
        ctx.fillStyle = "#FFD54A"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#FFE58A"; ctx.fillRect(0, 0, W, 10); ctx.fillStyle = "#FFC84A"; ctx.fillRect(0, 20, W, 10);
        ctx.fillStyle = "#2E9E57"; ctx.fillRect(0, 30, W, 18); ctx.fillStyle = "#1F7A44"; ctx.fillRect(0, 44, W, 4);
        const palm = (x, h) => { ctx.fillStyle = "#8A5A2B"; ctx.fillRect(x, 38 - h, 3, h); ctx.fillStyle = "#2E9E57"; ctx.fillRect(x - 8, 34 - h, 8, 3); ctx.fillRect(x + 3, 34 - h, 8, 3); ctx.fillRect(x - 5, 31 - h, 5, 3); ctx.fillRect(x + 3, 31 - h, 5, 3); ctx.fillStyle = "#5BE37D"; ctx.fillRect(x - 2, 30 - h, 7, 3); };
        palm(14, 18); palm(74, 22); palm(54, 12);
        ctx.fillStyle = "#1A1440"; ctx.fillRect(35, 12, 12, 12); ctx.fillStyle = "#FFFFFF"; ctx.fillRect(36, 13, 10, 10); ctx.fillStyle = "#1A1440";
        ctx.fillRect(38, 15, 2, 6); ctx.fillRect(42, 15, 2, 2); ctx.fillRect(42, 19, 2, 2); ctx.fillRect(40, 17, 2, 2);
    } else if (type === "py") {
        ctx.fillStyle = "#9BE7E8"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#D6F7F2"; ctx.fillRect(0, 14, W, 16);
        const peak = (x, h, w, col, sh) => { for (let j = 0; j < h; j++) { const half = (j * w / h) | 0; ctx.fillStyle = col; ctx.fillRect(x - half, 48 - h + j, half * 2, 1); ctx.fillStyle = sh; ctx.fillRect(x, 48 - h + j, half, 1); } };
        peak(24, 34, 30, "#6FA8CB", "#4F86A8"); peak(68, 40, 34, "#7FB6D6", "#5A92B4");
        ctx.fillStyle = "#fff"; ctx.fillRect(66, 8, 6, 4); ctx.fillRect(64, 12, 10, 4); ctx.fillRect(62, 16, 14, 3); ctx.fillRect(22, 14, 5, 3); ctx.fillRect(20, 17, 9, 3);
        ctx.fillStyle = "#1A1440"; ctx.fillRect(68, 2, 1, 8); ctx.fillStyle = "#FF6B8A"; ctx.fillRect(69, 2, 6, 4);
        ctx.fillStyle = "#fff"; for (let s = 0; s < 16; s++) ctx.fillRect((s * 37) % W, (s * 13) % 30, 1, 1);
        ctx.fillStyle = "#3A6FD8"; ctx.fillRect(0, 44, W, 4);
    }
}

function avatar(name, color) {
    let h = 0; for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    let out = "";
    for (let y = 0; y < 7; y++) for (let x = 0; x < 4; x++) {
        h = (h * 1103515245 + 12345) >>> 0;
        if ((h >>> 16) % 100 < 52) out += `<rect x="${x}" y="${y}" width="1" height="1"/><rect x="${6 - x}" y="${y}" width="1" height="1"/>`;
    }
    return `<svg width="36" height="36" viewBox="-1 -1 9 9" shape-rendering="crispEdges" aria-hidden="true"><rect x="-1" y="-1" width="9" height="9" fill="#1A1440"/><g fill="${color}">${out}</g></svg>`;
}

// === Typewriter hook ===
function useTypewriter() {
    const [text, setText] = useState("");
    const [done, setDone] = useState(false);
    const fullText = 'name = "Bit"\nprint("Salom, " + name)';

    useEffect(() => {
        let n = 0;
        let timeout1, timeout2;

        const iv = setInterval(() => {
            n++;
            setText(fullText.slice(0, n));
            if (n >= fullText.length) {
                clearInterval(iv);
                timeout1 = setTimeout(() => setDone(true), 500);
                timeout2 = setTimeout(() => {
                    setText("");
                    setDone(false);
                }, 9500);
            }
        }, 70);

        return () => {
            clearInterval(iv);
            clearTimeout(timeout1);
            clearTimeout(timeout2);
        };
    }, [done === false && text === ""]); // Restarts cycle when reset back to empty

    const html = text
        .replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/("[^"]*")/g, '<span class="k-s">$1</span>')
        .replace(/\bprint\b/g, '<span class="k-t">print</span>')
        .split("\n")
        .join("\n");

    return { html, done, isTyping: text.length < fullText.length };
}

// === Main component ===
export default function Landing() {
    const [selWorld, setSelWorld] = useState(0);
    const [fight, setFight] = useState({ hearts: 3, hp: 100, picked: {}, won: false, last: null });
    const [mentorTab, setMentorTab] = useState(0);
    const heroCv = useRef(null);
    const tw = useTypewriter();

    useEffect(() => {
        if (heroCv.current) drawHero(heroCv.current, 0);
        const iv = setInterval(() => {
            if (heroCv.current && !document.hidden) {
                drawHero(heroCv.current, Date.now() / 550 | 0);
            }
        }, 550);
        return () => clearInterval(iv);
    }, []);

    useEffect(() => {
        document.querySelectorAll("canvas[data-land]").forEach((cv) => {
            drawLand(cv, cv.dataset.land);
        });
    }, []);

    const pick = useCallback((i) => {
        setFight((f) => {
            if (f.won || f.hearts === 0 || f.picked[i]) return f;
            const b = BUG_OPTIONS[i];
            if (b.ok) return { ...f, picked: { ...f.picked, [i]: "ok" }, won: true, hp: 0, last: i };
            return { ...f, picked: { ...f.picked, [i]: "bad" }, hearts: f.hearts - 1, last: i };
        });
    }, []);
    const resetFight = () => setFight({ hearts: 3, hp: 100, picked: {}, won: false, last: null });
    const gameOver = fight.hearts === 0 && !fight.won;
    const bugCodeL2 = fight.won ? '<span class="k-t">print</span>(<span class="k-s">Salom, "</span> + name)' : '<span class="k-t">print</span>(<span class="k-3">"Salom, "</span> + nme)';

    return (
        <>
            <div>
                <CircuitTrace />

                {/* ===== HEADER ===== */}
                <header className="sticky top-0 z-40 -mx-4 px-4 py-3 bg-[color-mix(in_srgb,var(--bg)_92%,transparent)] backdrop-blur-sm border-b-4 border-[var(--bd)]">
                    <div className="mx-auto flex max-w-[1188px] items-center gap-[18px]">
                        <a href="#top" className="flex items-center gap-3 no-underline font-[var(--font-display)] font-bold text-2xl">
                            <Sprite name="bit" px={2} />
                            <span>Dev<span className="text-[var(--yellow)]">Lingo</span></span>
                        </a>
                        <nav className="flex gap-1 mx-auto">
                            {[["Worlds", "#worlds"], ["Quests", "#quest"], ["Boss fight", "#fight"], ["Rewards", "#loot"], ["Sidekick", "#sidekick"], ["Ranks", "#ranks"]].map(([label, href]) => (
                                <a key={href} href={href} className="px-3 py-2 no-underline text-[var(--muted)] font-[var(--font-label)] text-xs uppercase tracking-wider hover:text-white">
                                    {label}
                                </a>
                            ))}
                        </nav>
                        <div className="flex gap-2.5 items-center">
                            <a href="#final" className="btn-pixel sm">Log in</a>
                            <a href="#final" className="btn-pixel sm alt">Press start</a>
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-[1188px]" id="top">
                    {/* ===== HERO ===== */}
                    <section className="relative isolate pt-16 pb-12 w-full">
                        <div className="pointer-events-none absolute inset-0 -z-10 w-full h-full overflow-hidden" aria-hidden="true">
                            <svg className="w-full h-full opacity-80">
                                <defs>
                                    <pattern
                                        id="trace"
                                        width="120"
                                        height="120"
                                        patternUnits="userSpaceOnUse"
                                    >
                                        <g
                                            fill="none"
                                            style={{ stroke: "var(--bd)" }}
                                            strokeWidth="4"
                                            strokeLinecap="square"
                                        >
                                            <path d="M0 30H40V70H80V30H120" />
                                            <path d="M60 0V30M80 70V120M20 120V90H0" />
                                            <path d="M100 120V100H120" />
                                        </g>
                                        <g style={{ fill: "var(--bd)" }}>
                                            <rect x="36" y="26" width="8" height="8" />
                                            <rect x="76" y="66" width="8" height="8" />
                                            <rect x="56" y="-4" width="8" height="8" />
                                            <rect x="96" y="96" width="8" height="8" />
                                        </g>
                                    </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill="url(#trace)" />
                            </svg>
                        </div>

                        {/* Main content grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] gap-14 items-center">
                            <div>
                                <span className="inline-flex items-center gap-2.5 font-[var(--font-label)] text-[13px] tracking-widest uppercase text-[var(--yellow)] font-bold">
                                    <span className="w-2.5 h-2.5 bg-[var(--yellow)]" style={{ boxShadow: "12px 0 0 var(--green)" }} />
                                    <span className="ml-3">A coding adventure in Uzbek</span>
                                </span>
                                <h1 className="font-[var(--font-display)] font-bold text-[clamp(44px,6.2vw,84px)] leading-[0.98] tracking-tight mt-5 text-balance">
                                    Learn to code. <br /><em className="not-italic text-[var(--yellow)]" style={{ textShadow: "4px 4px 0 var(--ink)" }}>Level up</em> every day.
                                </h1>
                                <p className="text-[var(--muted)] text-lg max-w-[58ch] mt-4">Play through short lessons, write real code in your browser and collect XP.</p>

                                <div className="flex flex-wrap gap-5 mt-9">
                                    <a href="#fight" className="btn-pixel">Start playing <ArrowIcon /></a>
                                    <a href="#worlds" className="btn-pixel alt">See the worlds</a>
                                </div>
                                <div className="flex flex-wrap gap-4 mt-11">
                                    {[[<Sprite name="heart" px={3} />, "5", "Lives"], [<Sprite name="flame" px={3} />, "14", "Day streak"], [<Sprite name="star" px={3} />, "1,250", "XP"]].map(([icon, val, label], i) => (
                                        <div key={i} className="pc flex items-center gap-3 px-4 py-2.5 mx-1">
                                            {icon}
                                            <div>
                                                <b className="block font-[var(--font-display)] text-[22px] leading-none">{val}</b>
                                                <small className="block font-[var(--font-label)] text-[10px] tracking-widest uppercase text-[var(--faint)] mt-1">{label}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative pb-16 min-w-0">
                                <div className="relative bg-[var(--ink)] m-1 scene-scanlines" style={{ boxShadow: "-4px 0 0 var(--bd), 4px 0 0 var(--bd), 0 -4px 0 var(--bd), 0 4px 0 var(--bd)" }}>
                                    <canvas ref={heroCv} width={192} height={120} className="block w-full h-auto [image-rendering:pixelated] [aspect-ratio:192/120]" />
                                    <div className="absolute left-[62%] top-[14%] bg-white text-[#1A1440] font-[var(--font-label)] text-xs px-3 py-2 z-[2] whitespace-nowrap" style={{ boxShadow: "-3px 0 0 #1A1440, 3px 0 0 #1A1440, 0 -3px 0 #1A1440, 0 3px 0 #1A1440" }}>Let's code!</div>
                                </div>
                                <div className="absolute left-[-12px] right-[36%] bottom-[-24px] z-[3] bg-[var(--code-bg)] text-[var(--code-fg)] m-1" style={{ boxShadow: "-4px 0 0 var(--yellow), 4px 0 0 var(--yellow), 0 -4px 0 var(--yellow), 0 4px 0 var(--yellow)" }}>
                                    <div className="flex items-center gap-2 px-3 py-2 border-b-[3px] border-[var(--bd)] font-[var(--font-label)] text-[11px] text-[var(--faint)]">
                                        <i className="w-2.5 h-2.5 bg-[var(--coral)]" style={{ boxShadow: "16px 0 0 var(--yellow), 32px 0 0 var(--green)", marginRight: "40px" }} />
                                        quest_01.py
                                    </div>
                                    <pre className="m-0 px-3.5 py-3 font-[var(--font-mono)] text-[13px] leading-[1.8] min-h-[76px] overflow-x-auto" dangerouslySetInnerHTML={{ __html: tw.html + `<span class="caret"></span>` }} />
                                    <div className="flex items-center justify-between gap-2.5 px-3.5 py-2.5 border-t-[3px] border-dashed border-[var(--bd)] font-[var(--font-label)] text-sm min-h-[46px]">
                                        <span className="text-[var(--green)] font-semibold">{tw.done ? "Salom, Bit" : ""}</span>
                                        <span className="font-[var(--font-label)] font-bold text-sm text-[var(--yellow)] transition-opacity duration-300" style={{ opacity: tw.done ? 1 : 0 }}>
                                            +10 XP
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ===== TICKER ===== */}
                    <div className="mt-20 -mx-4 overflow-hidden bg-[var(--panel)] border-y-4 border-[var(--bd)] py-3.5">
                        <div className="flex w-max animate-slide">
                            {[0, 1].map((dup) => (
                                <span key={dup} className="flex items-center gap-7 pr-7 whitespace-nowrap font-[var(--font-label)] font-bold text-[15px] tracking-widest uppercase">
                                    {TICKER_WORDS.map((w) => <span key={w} className="flex items-center gap-7">{w} <Sprite name="star" px={2} /></span>)}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ===== WORLDS ===== */}
                    <section className="pt-[104px] pb-8" id="worlds" style={{ scrollMarginTop: "96px" }}>
                        <span className="inline-flex items-center gap-2.5 font-[var(--font-label)] text-[13px] tracking-widest uppercase text-[var(--yellow)] font-bold">
                            <span className="w-2.5 h-2.5 bg-[var(--yellow)]" style={{ boxShadow: "12px 0 0 var(--green)" }} />
                            <span className="ml-3">World map</span>
                        </span>
                        <h2 className="font-[var(--font-display)] font-bold text-[clamp(32px,4.4vw,52px)] leading-[1.05] tracking-tight mt-4 max-w-[18ch]">Pick your path</h2>
                        <p className="text-[var(--muted)] text-lg max-w-[58ch] mt-4">Each language is its own land with levels, bosses and loot.</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                            {WORLDS.map((w, i) => (
                                <button
                                    key={w.id}
                                    className={`pc flex flex-col mx-1 cursor-pointer transition-transform hover:-translate-y-1 text-left ${i === selWorld ? "pc-hl" : ""}`}
                                    style={{ border: 0, padding: 0, font: "inherit", color: "inherit" }}
                                    aria-pressed={i === selWorld}
                                    onClick={() => setSelWorld(i)}
                                >
                                    <canvas width={96} height={48} data-land={w.id} className="block w-full h-auto [image-rendering:pixelated] [aspect-ratio:2/1] border-b-4 border-[var(--bd)]" />
                                    <div className="p-[18px] pb-5 flex flex-col gap-2.5 flex-1">
                                        <div className="flex flex-wrap gap-2">
                                            <span className="font-[var(--font-label)] text-[10px] tracking-wider uppercase px-2 py-1.5 bg-[var(--yellow)] text-[var(--on-y)] font-bold">{w.tag}</span>
                                            <span className="font-[var(--font-label)] text-[10px] tracking-wider uppercase px-2 py-1.5 bg-[var(--panel2)] text-[var(--muted)] font-bold">{w.level}</span>
                                            <span className="font-[var(--font-label)] text-[10px] tracking-wider uppercase px-2 py-1.5 bg-[var(--panel2)] text-[var(--muted)] font-bold">{w.xp}</span>
                                        </div>
                                        <h3 className="font-[var(--font-display)] font-bold text-2xl leading-[1.1]">{w.name}</h3>
                                        <p className="text-[var(--muted)] text-[15px]">{w.desc}</p>
                                        <div className="mt-auto pt-3 flex items-center gap-2.5 border-t-[3px] border-dashed border-[var(--bd)] text-sm text-[var(--muted)]">
                                            <Sprite name="bug" px={2} />
                                            <span>Boss: <b className="text-[var(--fg)] font-semibold">{w.boss}</b></span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="pc flex flex-wrap items-center justify-between gap-4 mt-9 px-5 py-[18px] mx-1">
                            <p className="text-[var(--muted)]">Not sure where to start? Begin in HTML Hills. It needs no experience.</p>
                            <a href="#fight" className="btn-pixel sm">Try a quest</a>
                        </div>
                    </section>

                    {/* ===== QUEST ===== */}
                    <section className="pt-[104px] pb-8" id="quest" style={{ scrollMarginTop: "96px" }}>
                        <span className="inline-flex items-center gap-2.5 font-[var(--font-label)] text-[13px] tracking-widest uppercase text-[var(--yellow)] font-bold">
                            <span className="w-2.5 h-2.5 bg-[var(--yellow)]" style={{ boxShadow: "12px 0 0 var(--green)" }} />
                            <span className="ml-3">How it works</span>
                        </span>
                        <h2 className="font-[var(--font-display)] font-bold text-[clamp(32px,4.4vw,52px)] leading-[1.05] tracking-tight mt-4 max-w-[18ch]">Every lesson is a quest</h2>
                        <p className="text-[var(--muted)] text-lg max-w-[58ch] mt-4">Four steps, 25 minutes, the same rhythm every day.</p>

                        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-[52px] relative quest-line list-none p-0">
                            {QUEST_STEPS.map((s) => (
                                <li key={s.num} className="pc relative mx-1 px-5 pt-[22px] pb-6 flex flex-col gap-2.5 items-start">
                                    <span className="font-[var(--font-display)] absolute right-3.5 top-3 font-[var(--font-label)] text-xs text-[var(--faint)]">{s.num}</span>
                                    <span className="w-[60px] h-[60px] grid place-items-center bg-[var(--panel2)] mb-1">
                                        <Sprite name={s.icon} px={s.icon === "bug" ? 3 : 4} />
                                    </span>
                                    <h3 className="font-[var(--font-display)] font-bold text-2xl">{s.title}</h3>
                                    <p className="text-[var(--muted)] text-[15px]">{s.desc}</p>
                                    <span className="mt-auto font-[var(--font-label)] text-[11px] tracking-wider uppercase text-[var(--yellow)]">{s.min}</span>
                                </li>
                            ))}
                        </ol>

                        <div className="flex h-[22px] gap-1 mt-7 mx-1">
                            <i className="flex-[3] bg-[var(--blue)]" /><i className="flex-[10] bg-[var(--green)]" /><i className="flex-[8] bg-[var(--coral)]" /><i className="flex-[4] bg-[var(--yellow)]" />
                        </div>
                        <div className="mt-2.5 mx-1 font-[var(--font-label)] text-xs tracking-wider uppercase text-[var(--faint)]">Total: 25 minutes a day</div>
                    </section>

                    {/* ===== BOSS FIGHT ===== */}
                    <section className="pt-[104px] pb-8" id="fight" style={{ scrollMarginTop: "96px" }}>
                        <span className="inline-flex items-center gap-2.5 font-[var(--font-label)] text-[13px] tracking-widest uppercase text-[var(--yellow)] font-bold">
                            <span className="w-2.5 h-2.5 bg-[var(--yellow)]" style={{ boxShadow: "12px 0 0 var(--green)" }} />
                            <span className="ml-3">Try a quest</span>
                        </span>
                        <h2 className="font-[var(--font-display)] font-bold text-[clamp(32px,4.4vw,52px)] leading-[1.05] tracking-tight mt-4 max-w-[18ch]">Beat the Typo Bug</h2>
                        <p className="text-[var(--muted)] text-lg max-w-[58ch] mt-4">The boss "Typo Bug" broke this Python program. Pick the right fix to hit it.</p>

                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-7 mt-12">
                            <div className="pc m-1 p-0 overflow-hidden flex flex-col">
                                <div className="flex justify-between gap-4 px-[18px] py-4 border-b-4 border-[var(--bd)]">
                                    <div className="flex-1 min-w-0">
                                        <small className="flex justify-between font-[var(--font-label)] text-[11px] tracking-wider uppercase text-[var(--muted)] mb-1.5">
                                            <span>Typo Bug</span><span>{fight.hp}%</span>
                                        </small>
                                        <div className="h-4 bg-[var(--ink)] p-[3px]">
                                            <i className="block h-full bg-[var(--coral)] transition-all duration-500" style={{ width: fight.hp + "%" }} />
                                        </div>
                                    </div>
                                    <div style={{ flex: "0 0 auto" }}>
                                        <small className="font-[var(--font-label)] text-[11px] tracking-wider uppercase text-[var(--muted)] mb-1.5 block">Bit</small>
                                        <div className="flex gap-1.5 mt-0.5">
                                            {[0, 1, 2].map((i) => <Sprite key={i} name="heart" px={3} className={i >= fight.hearts ? "opacity-25 grayscale" : ""} />)}
                                        </div>
                                    </div>
                                </div>

                                <div className="relative min-h-[290px] flex items-end justify-between px-[8%] stage-ground" style={{ background: "var(--ink)" }}>
                                    <div className="relative z-[1] mb-[34px]"><Sprite name="bit" px={6} /></div>
                                    <div className="relative z-[1] mb-[34px]"><span className={fight.won ? "dead" : ""} style={{ transform: fight.won ? "scaleY(-1)" : "", transition: "transform .5s steps(5)" }}><Sprite name="bug" px={8} /></span></div>
                                </div>

                                <div className="pc m-1 p-[22px] flex flex-col gap-4 min-w-0">
                                    <h3 className="font-[var(--font-display)] font-bold text-[22px]">Broken program</h3>
                                    <pre className="m-0 bg-[var(--code-bg)] text-[var(--code-fg)] font-[var(--font-mono)] text-[13.5px] leading-[1.9] py-3 overflow-x-auto" dangerouslySetInnerHTML={{ __html: `name = "Dilnoza"\nprint("Salom, " + nane)` }} />
                                    <div className="bg-[var(--panel2)] px-4 py-3.5 text-[15px] min-h-[92px] mx-1" style={{ boxShadow: "-3px 0 0 var(--bd), 3px 0 0 var(--bd), 0 -3px 0 var(--bd), 0 3px 0 var(--bd)" }}>
                                        {gameOver ? (
                                            <span className="block font-[var(--font-mono)] text-[13px] mb-1.5 font-bold text-[var(--coral)]">GAME OVER</span>
                                        ) : fight.last !== null ? (
                                            <span className={`block font-[var(--font-mono)] text-[13px] mb-1.5 font-bold ${BUG_OPTIONS[fight.last].ok ? "text-[var(--green)]" : "text-[var(--coral)]"}`}>
                                                {BUG_OPTIONS[fight.last].out}
                                            </span>
                                        ) : (
                                            <span className="block font-[var(--font-mono)] text-[13px] mb-1.5 font-bold text-[var(--coral)]">NameError: name 'nane' is not defined</span>
                                        )}
                                    </div>
                                    <h3 className="font-[var(--font-display)] font-bold text-[22px]">Which change fixes it?</h3>
                                    <div className="flex flex-col gap-3">
                                        {BUG_OPTIONS.map((b, i) => {
                                            const st = fight.picked[i];
                                            const cls = st === "ok" ? "bg-[color-mix(in_srgb,var(--green)_22%,var(--panel))]" : st === "bad" ? "opacity-55" : "";
                                            const bdColor = st === "ok" ? "var(--green)" : st === "bad" ? "var(--coral)" : "var(--bd)";
                                            return (
                                                <button
                                                    key={i}
                                                    disabled={fight.won || gameOver || !!st}
                                                    onClick={() => pick(i)}
                                                    className={`text-left border-0 bg-[var(--panel2)] px-3.5 py-[13px] cursor-pointer flex items-center gap-3 text-[15px] mx-1 ${cls}`}
                                                    style={{ boxShadow: `-3px 0 0 ${bdColor}, 3px 0 0 ${bdColor}, 0 -3px 0 ${bdColor}, 0 3px 0 ${bdColor}` }}
                                                >
                                                    <span className="w-7 h-7 grid place-items-center bg-[var(--bd)] font-[var(--font-label)] font-bold text-xs text-white flex-none">{i + 1}</span>
                                                    <span dangerouslySetInnerHTML={{ __html: b.text }} />
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <button className="btn-pixel alt sm self-start" onClick={resetFight}>Restart fight</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ===== LOOT ===== */}
                    <section className="pt-[104px] pb-8" id="loot" style={{ scrollMarginTop: "96px" }}>
                        <span className="inline-flex items-center gap-2.5 font-[var(--font-label)] text-[13px] tracking-widest uppercase text-[var(--yellow)] font-bold">
                            <span className="w-2.5 h-2.5 bg-[var(--yellow)]" style={{ boxShadow: "12px 0 0 var(--green)" }} />
                            <span className="ml-3">Rewards</span>
                        </span>
                        <h2 className="font-[var(--font-display)] font-bold text-[clamp(32px,4.4vw,52px)] leading-[1.05] tracking-tight mt-4 max-w-[18ch]">Collect XP and loot</h2>
                        <p className="text-[var(--muted)] text-lg max-w-[58ch] mt-4">Every quest pays out. Small wins add up to a habit.</p>
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-7 mt-12">
                            <div className="pc m-1 p-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                    {BADGES.map((b) => (
                                        <div key={b.n} className={`flex flex-col items-center gap-2.5 text-center p-1.5 ${b.on ? "" : "opacity-60"}`}>
                                            <span className="relative w-[72px] h-[72px] bg-[var(--ink)] badge-emblem">
                                                <i className="absolute inset-[5px] badge-emblem grid place-items-center font-[var(--font-label)] font-bold text-base not-italic" style={{ background: b.on ? "#14103A" : "var(--faint)" }}>{b.on ? b.g : "?"}</i>
                                            </span>
                                            <b className="font-[var(--font-display)] font-semibold text-base leading-[1.2]">{b.n}</b>
                                            <small className="text-[var(--faint)] text-[13px] leading-[1.35]">{b.d}</small>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pc m-1 p-[22px] flex flex-col gap-[18px]">
                                <h3 className="font-[var(--font-display)] font-bold text-[22px]">This week</h3>
                                <div className="grid grid-cols-7 gap-2">
                                    {[["MON", ""], ["TUE", ""], ["WED", ""], ["THU", ""], ["FRI", ""], ["SAT", ""], ["SUN", "1"]].map((d, i) => (
                                        <div
                                            key={d[0]}
                                            className={`flex flex-col items-center gap-1.5 py-2.5 px-0 font-[var(--font-label)] text-[10px] ${i < 4 ? "bg-[color-mix(in_srgb,var(--yellow)_20%,var(--panel))]" : "bg-[var(--panel2)]"} text-[var(--faint)] ${i === 3 ? "outline-[3px] outline-[var(--yellow)] outline-offset-2" : ""}`}
                                        >
                                            <span>{d[0]}</span>
                                            <Sprite name="flame" px={3} className={i >= 4 ? "opacity-25 grayscale" : ""} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-between font-[var(--font-label)] text-xs tracking-wider uppercase text-[var(--muted)]">
                                    <span>Level 7</span><span>640 / 1000 XP</span>
                                </div>
                                <div className="h-[22px] bg-[var(--ink)] p-1 flex gap-[3px]">
                                    {Array.from({ length: 16 }).map((_, i) => <i key={i} className="flex-1" style={{ background: i < 10 ? "var(--green)" : "var(--panel2)" }} />)}
                                </div>
                            </div>

                            <div className="flex items-center gap-3 font-[var(--font-display)] font-bold text-[26px]">
                                <Sprite name="coin" px={4} />
                                <span>1,250</span>
                                <small className="font-[var(--font-label)] text-[11px] tracking-wider text-[var(--faint)] uppercase font-normal">OZY</small>
                            </div>
                        </div>
                    </section>

                    {/* ===== SIDEKICK ===== */}
                    <section className="pt-[104px] pb-8" id="sidekick" style={{ scrollMarginTop: "96px" }}>
                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 items-start">
                            <div>
                                <span className="inline-flex items-center gap-2.5 font-[var(--font-label)] text-[13px] tracking-widest uppercase text-[var(--yellow)] font-bold">
                                    <span className="w-2.5 h-2.5 bg-[var(--yellow)]" style={{ boxShadow: "12px 0 0 var(--green)" }} />
                                    <span className="ml-3">Sidekick</span>
                                </span>
                                <h2 className="font-[var(--font-display)] font-bold text-[clamp(32px,4.4vw,52px)] leading-[1.05] tracking-tight mt-4 max-w-[18ch]">Meet Bit</h2>
                                <p className="text-[var(--muted)] text-lg max-w-[58ch] mt-4">Stuck at 2 a.m.? Bit helps at three levels, so you learn instead of copy-pasting.</p>
                                <div className="flex flex-col gap-3.5 mt-8">
                                    {MENTOR_TABS.map((m, i) => (
                                        <button
                                            key={m.k}
                                            aria-selected={i === mentorTab}
                                            onClick={() => setMentorTab(i)}
                                            className={`text-left border-0 ${i === mentorTab ? "pc-hl bg-[var(--panel2)]" : "bg-[var(--panel)]"} px-[18px] py-4 cursor-pointer`}
                                            style={{ boxShadow: i === mentorTab ? "-4px 0 0 var(--yellow), 4px 0 0 var(--yellow), 0 -4px 0 var(--yellow), 0 4px 0 var(--yellow)" : "" }}
                                        >
                                            <span className={`w-[34px] h-[34px] grid place-items-center font-[var(--font-label)] font-bold text-sm flex-none ${i === mentorTab ? "bg-[var(--bd)] text-white" : ""}`}>{i + 1}</span>
                                            <span>
                                                <b className="block font-[var(--font-display)] font-bold text-xl">{m.label}</b>
                                                <span className="block text-[var(--muted)] text-sm leading-[1.5] mt-0.5">{m.desc}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pc m-1">
                                <div className="flex items-center gap-3.5 px-[18px] py-3.5 border-b-4 border-[var(--bd)]">
                                    <Sprite name="bit" px={3} />
                                    <div>
                                        <b className="block font-[var(--font-display)] text-xl leading-[1.1]">Bit</b>
                                        <small className="text-[var(--faint)] text-xs font-[var(--font-label)] tracking-wider uppercase">AI sidekick · Python</small>
                                    </div>
                                    <span className="ml-auto font-[var(--font-label)] text-[10px] tracking-wider uppercase px-2 py-1.5 bg-[var(--yellow)] text-[var(--on-y)] font-bold">ONLINE</span>
                                </div>
                                <div className="p-5 flex flex-col gap-4 min-h-[368px]">
                                    <SidekickChat tab={mentorTab} />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ===== RANKS ===== */}
                    <section className="pt-[104px] pb-8" id="ranks" style={{ scrollMarginTop: "96px" }}>
                        <span className="inline-flex items-center gap-2.5 font-[var(--font-label)] text-[13px] tracking-widest uppercase text-[var(--yellow)] font-bold">
                            <span className="w-2.5 h-2.5 bg-[var(--yellow)]" style={{ boxShadow: "12px 0 0 var(--green)" }} />
                            <span className="ml-3">Weekly ranks</span>
                        </span>
                        <h2 className="font-[var(--font-display)] font-bold text-[clamp(32px,4.4vw,52px)] leading-[1.05] tracking-tight mt-4 max-w-[18ch]">Climb the league</h2>
                        <p className="text-[var(--muted)] text-lg max-w-[58ch] mt-4">The top 10 move up a league every Sunday.</p>

                        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] gap-7 mt-12">
                            <div className="pc m-1 p-2">
                                {BOARD.map((r, i) => {
                                    const me = r[0] === "You";
                                    return (
                                        <div key={i} className={`grid grid-cols-[36px_36px_minmax(0,1fr)_auto_auto] gap-3.5 items-center px-3.5 py-3 ${i % 2 ? "bg-[color-mix(in_srgb,var(--yellow)_20%,var(--panel))]" : ""}`} style={{ outline: me ? "3px solid var(--yellow)" : "", outlineOffset: "-3px" }}>
                                            <span className="font-[var(--font-display)] font-bold text-xl text-[var(--yellow)]">{me ? 12 : i + 1}</span>
                                            <span className="px-img" dangerouslySetInnerHTML={{ __html: avatar(r[0], r[2]) }} />
                                            <span className="font-semibold min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{me ? "You" : r[0]}</span>
                                            <span className="font-[var(--font-label)] text-[10px] tracking-wider uppercase px-2 py-1.5 bg-[var(--panel2)] text-[var(--muted)]">{r[3]}</span>
                                            <span className="font-[var(--font-mono)] font-bold tabular-nums">{r[1].toLocaleString("en-US")} XP</span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pc m-1 p-[22px] flex flex-col gap-3">
                                <h3 className="font-[var(--font-display)] font-bold text-[22px]">Leagues</h3>
                                {LEAGUES.map((l) => (
                                    <div key={l.name} className={`flex items-center gap-3.5 px-3.5 py-3 bg-[var(--panel2)]`} style={{ outline: l.cur ? "3px solid var(--yellow)" : "", boxShadow: "inset -4px -4px 0 rgba(0,0,0,0.25), inset 4px 4px 0 rgba(255,255,255,0.05)" }}>
                                        <i className="w-[22px] h-[22px]" style={{ background: l.c, boxShadow: "inset -4px -4px 0 rgba(0,0,0,0.25), inset 4px 4px 0 rgba(255,255,255,0.25)" }} />
                                        <b className="font-[var(--font-display)] font-semibold text-lg">{l.name}</b>
                                        <small className="ml-auto text-[var(--faint)] font-[var(--font-label)] text-[10px] tracking-wider uppercase">{l.note}</small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* ===== FINAL ===== */}
                    <section className="pc relative isolate overflow-hidden mt-28 mx-1 p-[clamp(36px,6vw,80px)] flex flex-wrap gap-8 items-center justify-between">
                        <div className="absolute inset-0 z-[-1] opacity-90"><svg><rect width="100%" height="100%" fill="url(#trace)" /></svg></div>
                        <div>
                            <h2 className="font-[var(--font-display)] font-bold text-[clamp(34px,5vw,60px)] leading-none max-w-[14ch] text-balance">
                                Your first quest takes five minutes<span className="caret ml-1" style={{ width: 16, height: "0.8em", verticalAlign: "-0.04em" }} />
                            </h2>
                            <p className="text-[var(--muted)] mt-3.5 max-w-[44ch]">Open the editor, type one line, see it run. Bit is waiting.</p>
                        </div>
                        <a href="#fight" className="btn-pixel">Start playing <ArrowIcon /></a>
                    </section>
                </main>

                {/* ===== FOOTER ===== */}
                <footer className="mt-16 border-t-4 border-[var(--bd)] pt-6 pb-11 flex flex-wrap gap-4 justify-between text-[var(--muted)] text-sm">
                    <span>Made in Tashkent.</span>
                    <span className="flex gap-[22px] flex-wrap">
                        <a href="#worlds" className="no-underline font-[var(--font-label)] text-xs tracking-wider uppercase hover:text-[var(--yellow)]">Worlds</a>
                        <a href="#loot" className="no-underline font-[var(--font-label)] text-xs tracking-wider uppercase hover:text-[var(--yellow)]">Rewards</a>
                        <a href="#ranks" className="no-underline font-[var(--font-label)] text-xs tracking-wider uppercase hover:text-[var(--yellow)]">Ranks</a>
                    </span>
                </footer>
            </div >
        </>
    )
}

function ArrowIcon() {
    return (
        <svg className="w-5 h-5 flex-none fill-none stroke-current" strokeWidth={2} strokeLinecap="square" strokeLinejoin="miter" viewBox="0 0 24 24">
            <path d="M4 12h15M13 6l6 6-6 6" />
        </svg>
    );
}

function SidekickChat({ tab }) {
    const chats = [
        {
            me: 'My loop never stops. Why?<pre class="code mt-2 text-[12.5px] leading-[1.7] py-2" style="background:var(--code-bg);box-shadow:inset 0 0 0 3px var(--bd)"><span class="block pl-3.5 whitespace-pre"><span class="k-k">while</span> i &lt; 5:</span><span class="block pl-3.5 whitespace-pre">    <span class="k-t">print</span>(i)</span></pre>',
            ai: 'Look at the value of <code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">i</code>. What happens to it each time the loop runs?',
        },
        {
            me: 'My loop never stops. Why?<pre class="code mt-2 text-[12.5px] leading-[1.7] py-2" style="background:var(--code-bg);box-shadow:inset 0 0 0 3px var(--bd)"><span class="block pl-3.5 whitespace-pre"><span class="k-k">while</span> i &lt; 5:</span><span class="block pl-3.5 whitespace-pre">    <span class="k-t">print</span>(i)</span></pre>',
            ai: 'A <code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">while</code> loop repeats until its condition is False. Here <code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">i &lt; 5</code> stays True forever. Add one line at the end to increase <code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">i</code>:<pre class="code mt-2 text-[12.5px] leading-[1.7] py-2" style="background:var(--code-bg);box-shadow:inset 0 0 0 3px var(--bd)"><span class="block pl-3.5 whitespace-pre"><span class="k-k">while</span> i &lt; 5:</span><span class="block pl-3.5 whitespace-pre">    <span class="k-t">print</span>(i)</span><span class="block pl-3.5 bg-[rgba(255,213,74,0.15)]">    i += 1</span></pre>',
        },
        {
            me: 'Can you check my code?<pre class="code mt-2 text-[12.5px] leading-[1.7] py-2" style="background:var(--code-bg);box-shadow:inset 0 0 0 3px var(--bd)"><span class="block pl-3.5 whitespace-pre">x = 0</span><span class="block pl-3.5 whitespace-pre"><span class="k-k">while</span> x &lt; 5:</span><span class="block pl-3.5 whitespace-pre">    <span class="k-t">print</span>(x)</span><span class="block pl-3.5 whitespace-pre">    x = x + 1</span></pre>',
            ai: 'It works. Three notes:<ol class="list-decimal pl-5 flex flex-col gap-1 mt-1.5"><li>Rename <code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">x</code> to <code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">count</code> so it holds what it represents.</li><li><code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">count += 1</code> is the shorter, common form.</li><li>A <code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">for</code> loop with <code class="font-mono bg-[var(--code-bg)] text-[var(--code-fg)] px-1">range(5)</code> does the same in two lines.</li>Completing this step will make your code much cleaner.</li></ol>',
        },
    ];

    const c = chats[tab];
    return (
        <>
            <div className="max-w-[90%] self-end bg-[var(--purple)] text-[#14103A] px-3.5 py-3 text-[15px] leading-[1.55] mx-1" style={{ boxShadow: "-3px 0 0 var(--ink), 3px 0 0 var(--ink), 0 -3px 0 var(--ink), 0 3px 0 var(--ink)" }} dangerouslySetInnerHTML={{ __html: c.me }} />
            <div className="max-w-[90%] self-start bg-[var(--panel2)] px-3.5 py-3 text-[15px] leading-[1.55] mx-1" style={{ boxShadow: "-3px 0 0 var(--bd), 3px 0 0 var(--bd), 0 -3px 0 var(--bd), 0 3px 0 var(--bd)" }} dangerouslySetInnerHTML={{ __html: c.ai }} />
        </>
    );
}