import React from 'react';
import { ArrowUpRight, Check } from 'lucide-react';

const pad = 'px-[clamp(24px,6vw,96px)]';
const revealBase = 'opacity-0 transition-[opacity,translate] duration-[760ms] ease-harbor motion-reduce:translate-none motion-reduce:opacity-100 [&.is-visible]:translate-none [&.is-visible]:opacity-100';
const reveal = `${revealBase} translate-y-7`;

const promises = ['No credit card', 'Nothing to install', 'Your first lesson is free'];

function Join() {
    return (
        <section className={`bg-white py-24 max-[720px]:py-16 ${pad}`} id="final-cta">
            <div
                className={`relative mx-auto flex max-w-[1200px] items-center justify-between gap-x-14 gap-y-10 overflow-hidden rounded-[26px] border border-ink/10 px-[clamp(28px,5vw,72px)] py-[clamp(40px,5vw,64px)] shadow-[0_30px_70px_-45px_rgba(18,20,26,0.45)] max-[980px]:flex-col max-[980px]:items-start ${reveal}`}
                data-reveal
            >
                {/* Backdrop: a warm glow, a faint dot grid and two thin rings */}
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    <div className="absolute -right-20 -top-40 size-[420px] rounded-full bg-signal/30 blur-[100px]"></div>
                    <div className="absolute -bottom-44 right-[26%] size-[320px] rounded-full bg-ember-soft/20 blur-[100px]"></div>
                    <div className="absolute inset-0 [background:radial-gradient(rgba(18,20,26,0.09)_1px,transparent_1.2px)] [background-size:20px_20px] [mask-image:linear-gradient(100deg,transparent_35%,black)]"></div>
                    <div className="absolute -right-[150px] top-1/2 size-[460px] -translate-y-1/2 rounded-full border border-ink/[0.07]"></div>
                    <div className="absolute -right-[60px] top-1/2 size-[280px] -translate-y-1/2 rounded-full border border-ink/[0.07]"></div>
                </div>

                <div className="relative max-w-[640px]">
                    <div className="flex items-center gap-2.5 font-plex text-[10px] uppercase tracking-[0.14em] text-muted">
                        <span className="relative flex size-2">
                            <span className="absolute inset-0 animate-ping rounded-full bg-signal motion-reduce:animate-none"></span>
                            <span className="relative size-2 rounded-full bg-signal"></span>
                        </span>
                        Ready when you are
                    </div>
                    <h2 className="mt-5 font-editorial text-[length:clamp(40px,4.6vw,66px)] leading-[1] tracking-[-0.02em]">
                        Start the journey with <em className="text-ember">one free lesson.</em>
                    </h2>
                    <p className="mt-4 max-w-[470px] text-[16px] leading-[1.6] text-ink/70">
                        Pick a course, write your first lines of code in the browser, and see how far ten minutes can take you.
                    </p>
                </div>

                <div className="relative flex flex-none flex-col items-start gap-6">
                    <ul className="flex flex-col gap-2 text-[13px] text-ink/75">
                        {promises.map((promise) => (
                            <li className="flex items-center gap-2.5" key={promise}>
                                <span className="flex size-[18px] flex-none items-center justify-center rounded-full bg-sage/30 text-[#3f6a4c]">
                                    <Check size={11} strokeWidth={3} aria-hidden="true" />
                                </span>
                                {promise}
                            </li>
                        ))}
                    </ul>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
                        <a
                            className="group inline-flex h-14 items-center gap-3 rounded-full bg-ink pl-7 pr-2.5 text-[15px] max-[420px]:h-12 max-[420px]:pl-5 max-[420px]:pr-2 max-[420px]:text-[14px] font-semibold text-paper transition duration-180 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-14px_rgba(18,20,26,0.7)]"
                            href="#paths"
                        >
                            Start your first lesson
                            <span className="flex size-9 items-center justify-center rounded-full bg-signal text-ink transition-transform duration-300 group-hover:rotate-45">
                                <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Join;
