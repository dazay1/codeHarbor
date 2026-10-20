import React from "react";
const PAL = {
  o: "#1A1440", n: "#1A1440", w: "#FFFFFF", y: "#FFD54A", Y: "#E0A21F",
  r: "#FF6B8A", R: "#C93A5E", g: "#5BE37D", G: "#2E9E57", b: "#6FA8FF",
  B: "#3A6FD8", p: "#9B8DFF", P: "#5B4DD1", k: "#B9B3E6",
};


const SP = {
  bit: [
    ".......oo.......",
    "......oyyo......",
    ".......oo.......",
    ".......oo.......",
    "..oooooooooooo..",
    ".oppppppppppppo.",
    ".opnnnnnnnnnnpo.",
    ".opnggnnnnggnpo.",
    ".opnggnnnnggnpo.",
    ".opnnnnnnnnnnpo.",
    ".opnngnnnngnnpo.",
    ".opnnnggggnnnpo.",
    ".oPPPPPPPPPPPPo.",
    "..oooooooooooo..",
    "..oyyo....oyyo..",
    "..oooo....oooo..",
  ],
  heart: [
    "..ooo.ooo..",
    ".orrrooorrro.".slice(0, 11),
    "orwrrrrrrro",
    "orrrrrrrrRo",
    ".orrrrrrRo.",
    "..orrrrRo..",
    "...orrRo...",
    "....oRo....",
    ".....o.....",
  ],
  star: [
    ".....o.....",
    "....oyo....",
    "....oyo....",
    "ooooyyyoooo",
    "oyyyywyyyyo",
    ".oyyyyyyyo.",
    "..oyyyyyo..",
    "..oyyyyyo..",
    ".oyyo.oyyo.",
    ".ooo...ooo.",
  ],
  coin: [
    "...oooo...",
    "..oyyyyo..",
    ".oywyyyYo.",
    "oywyyyyyYo",
    "oyyyyyyyYo",
    "oyyyyyyyYo",
    "oyyyyyyYYo",
    ".oyyyYYYo.",
    "..oYYYYo..",
    "...oooo...",
  ],
  flame: [
    "....o....",
    "...oro...",
    "...orro..",
    "..orrro..",
    ".orryrro.",
    ".orryyro.",
    "orrryyyro",
    "orryywyro",
    "orryywyro",
    ".orryyyro",
    "..orrrro.",
    "...oooo..",
  ],
  trophy: [
    ".oooooooooo.",
    "oyyyyyyyyyyo",
    "oywyyyyyyYyo",
    "oywyyyyyyYyo",
    ".oywyyyyYyo.",
    "..oyyyyYYo..",
    "...oyyYYo...",
    "....oYYo....",
    "....oYYo....",
    "...oyyyyo...",
    "..oYYYYYYo..",
    "..oooooooo..",
  ],
  bug: [
    "..o..........o..",
    "...o........o...",
    "....oooooooo....",
    "...orrrrrrrro...",
    "..orwwrrrrwwro..",
    "..orwoRrrRowro..",
    ".oorrrrrrrrrroo.",
    "orrrRrrrrrrRrrro",
    ".orrrrrrrrrrrro.",
    "o.orrRrrrrRrro.o",
    "o..oorrrrrroo..o",
    "...o.oooooo.o...",
    "..o..........o..",
  ],
  book: [
    ".oooooooooo.",
    "owwwwoowwwwo",
    "owkkwoowkkwo",
    "owwwwoowwwwo",
    "owkkwoowkkwo",
    "owwwwoowwwwo",
    "owkkwoowkkwo",
    "owwwwoowwwwo",
    "obbbbbbbbbbo",
    ".oooooooooo.",
  ],
  term: [
    ".oooooooooo.",
    "onnnnnnnnnno",
    "ongnnnnnnnno",
    "onngnnnnnnno",
    "ongnnnggnnno",
    "onnnnnnnnnno",
    "onnnnnnnnnno",
    ".oooooooooo.",
  ],
};

export function Sprite({ name, px = 3, className = "" }) {
  const rows = SP[name];
  if (!rows) return null;

  const h = rows.length;
  const w = rows[0].length;
  let out = "";

  rows.forEach((r, y) => {
    let x = 0;
    while (x < w) {
      const c = r.charAt(x);
      if (c === ".") {
        x++;
        continue;
      }
      let x2 = x;
      while (x2 < w && r.charAt(x2) === c) x2++;
      out += `<rect x="${x}" y="${y}" width="${x2 - x}" height="1" fill="${PAL[c]}"/>`
      x = x2;
    }
  })

  return (
    <span className={`px-img ${className}`} dangerouslySetInnerHTML={{ __html: `<svg width="${w * px}" height="${h * px}" viewBox="0 0 ${w} ${h}" shape-rendering="cirspEdges" aria-hidden="true">${out}</svg>`, }} />
  );
}

export function CircuitTrace() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 h-full w-full overflow-hidden">
      <svg
        className="h-full w-full opacity-30"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="trace"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            <g
              fill="none"
              style={{ stroke: "var(--circuit)" }}
              strokeWidth="4"
              strokeLinecap="square"
            >
              <path d="M0 30H40V70H80V30H120" />
              <path d="M60 0V30M80 70V120M20 120V90H0" />
              <path d="M100 120V100H120" />
            </g>
            <g style={{ fill: "var(--circuit)" }}>
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
  );
}