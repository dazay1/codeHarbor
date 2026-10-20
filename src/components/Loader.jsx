import React from 'react';
import { BeaconMark } from './LearnBar';

// Full-screen loading state: the beacon mark, a sweeping bar and a short message.
export default function Loader({ text = 'Loading' }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-7 bg-[#0a0b10] px-6 text-center text-paper" role="status" aria-live="polite">
            <div className="flex size-20 items-center justify-center rounded-[22px] border border-paper/10 bg-paper/[0.04] shadow-[0_0_60px_-10px_var(--color-signal)] animate-pulse">
                <span className="origin-center scale-150"><BeaconMark /></span>
            </div>
            <div>
                <p className="font-editorial text-[30px] leading-none">{text}</p>
                <p className="mt-2.5 font-plex text-[11px] uppercase tracking-[0.18em] text-paper/45">One moment</p>
            </div>
            <span className="relative block h-1 w-48 overflow-hidden rounded-full bg-paper/10" aria-hidden="true">
                <span className="loader-sweep absolute inset-y-0 left-0 w-1/3 rounded-full bg-signal"></span>
            </span>
        </div>
    );
}
