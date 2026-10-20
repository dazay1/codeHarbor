import React from 'react';
import { Link } from 'react-router-dom';

export function BeaconMark() {
    return (
        <span className="relative inline-block h-[26px] w-[27px] flex-none" aria-hidden="true">
            <i className="absolute left-[7px] top-[3px] block h-[5px] w-[13px] bg-signal"></i>
            <b className="absolute left-[5px] top-[10px] block h-[5px] w-[17px] bg-paper"></b>
            <em className="absolute bottom-px left-[8px] block size-0 border-x-[5px] border-b-[5px] border-x-transparent border-b-paper"></em>
        </span>
    );
}

// Text with **bold** and `code` marks, used by the course and lesson pages.
export function Inline({ text }) {
    return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
        if (part.startsWith('**')) return <strong className="font-semibold text-paper" key={i}>{part.slice(2, -2)}</strong>;
        if (part.startsWith('`')) return <code className="rounded-[5px] bg-paper/10 px-1.5 py-0.5 font-plex text-[0.88em] text-signal-soft" key={i}>{part.slice(1, -1)}</code>;
        return part;
    });
}

// The dark top bar shared by the course overview and the lesson workspace.
export default function LearnBar({ children }) {
    return (
        <header className="flex h-16 flex-none items-center gap-6 border-b border-paper/10 bg-[#0a0b10] px-[clamp(16px,3vw,32px)] text-paper">
            <Link className="inline-flex flex-none items-center gap-[10px] text-[18px] font-bold tracking-[-0.07em]" to="/" aria-label="Code Harbor home">
                <BeaconMark />
                <span className="max-[720px]:hidden">code<span className="font-medium text-paper/60">harbor</span></span>
            </Link>
            <div className="flex min-w-0 flex-1 items-center gap-6">{children}</div>
            <div className="flex flex-none items-center gap-5">
                <Link className="text-[13px] text-paper/70 transition-colors duration-180 hover:text-paper max-[720px]:hidden" to="/login">Sign in</Link>
                <Link className="inline-flex h-10 items-center rounded-full bg-signal px-4 text-[13px] font-semibold text-ink transition-colors duration-180 hover:bg-signal-soft" to="/signup">Sign up</Link>
            </div>
        </header>
    );
}
