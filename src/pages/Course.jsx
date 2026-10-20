import React, { useState } from 'react';
import Loader from '../components/Loader';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowUpRight, Award, Check, ChevronDown, Lock, User, Zap, BookOpen } from 'lucide-react';
import { scenes, courses } from '../components/Path';
import LearnBar from '../components/LearnBar';
import { playableOf, isPlayable, xpOf, exerciseKey } from '../data/curriculum';
import { useProgress } from '../learn/progress';
import { useCourse } from '../learn/backend';

const panel = 'rounded-[18px] border border-paper/10 bg-paper/[0.03]';
const label = 'font-plex text-[10px] uppercase tracking-[0.14em]';

function Meter({ value, total }) {
    return (
        <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-paper/10">
            <span className="block h-full rounded-full bg-signal transition-[width] duration-500" style={{ width: `${total ? (value / total) * 100 : 0}%` }}></span>
        </span>
    );
}

export default function Course() {
    const { courseId } = useParams();
    const info = courses.find((course) => course.id === courseId);
    const { course, loading } = useCourse(courseId);
    const { isDone } = useProgress();

    const ready = playableOf(course);
    const keyOf = (exercise) => exerciseKey(courseId, exercise.chapter.id, exercise.id);
    const pathOf = (exercise) => `/course/${keyOf(exercise)}`;
    const finished = ready.filter((exercise) => isDone(keyOf(exercise)));
    const next = ready.find((exercise) => !isDone(keyOf(exercise)));

    // Until the learner picks a chapter, the one holding their next exercise is open.
    const [pickedId, setPickedId] = useState(undefined);

    if (loading) return <Loader text="Opening your course" />;
    if (!info || !course) return <Navigate to="/" replace />;

    const openId = pickedId === undefined ? (next?.chapter.id ?? course.chapters[0].id) : pickedId;

    const total = course.chapters.reduce((sum, chapter) => sum + chapter.exercises.length, 0);
    const xp = finished.reduce((sum, exercise) => sum + xpOf(exercise), 0);
    const xpTotal = ready.reduce((sum, exercise) => sum + xpOf(exercise), 0);
    // An exercise opens once the one before it is finished.
    const unlocked = (exercise) => {
        const index = ready.findIndex((item) => keyOf(item) === keyOf(exercise));
        return index === 0 || isDone(keyOf(ready[index - 1]));
    };
    const chapterDone = (chapter) => chapter.exercises.length > 0 && chapter.exercises.every((exercise) => isPlayable(exercise) && isDone(exerciseKey(courseId, chapter.id, exercise.id)));

    return (
        <div className="min-h-screen bg-[#0a0b10] font-grotesk text-paper antialiased selection:bg-signal selection:text-ink">
            <LearnBar>
                <Link className="text-[13px] text-paper/70 transition-colors duration-180 hover:text-paper" to="/">All courses</Link>
            </LearnBar>

            {/* Banner: the course's own landscape from the home page */}
            <section className="relative isolate overflow-hidden border-b border-paper/10">
                <div className="absolute inset-0 -z-10">{scenes[courseId]}</div>
                <div className="absolute inset-0 -z-10 bg-linear-to-r from-[#0a0b10] via-[#0a0b10]/75 via-45% to-transparent max-[720px]:via-[#0a0b10]/85 max-[720px]:to-[#0a0b10]/60"></div>
                <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-linear-to-t from-[#0a0b10] to-transparent"></div>

                <div className="mx-auto max-w-[1200px] px-[clamp(20px,4vw,40px)] pb-16 pt-[clamp(56px,8vw,96px)]">
                    <div className="flex items-center gap-3">
                        <span className={`${label} rounded-full border border-paper/30 bg-ink/40 px-3 py-1.5 backdrop-blur-md`}>{info.level}</span>
                        <span className={`${label} text-paper/75`}>Course {info.number}</span>
                    </div>
                    <h1 className="mt-6 font-editorial text-[length:clamp(56px,8vw,104px)] leading-[0.92] tracking-[-0.02em]">{info.title}</h1>
                    <p className="mt-5 max-w-[540px] text-[length:clamp(16px,1.5vw,19px)] leading-[1.55] text-paper/85">{course.tagline}</p>

                    <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
                        {next ? (
                            <Link
                                className="group inline-flex h-14 items-center gap-3 rounded-full bg-signal pl-7 pr-2.5 text-[15px] font-semibold text-ink transition duration-180 hover:-translate-y-0.5 hover:bg-signal-soft"
                                to={pathOf(next)}
                            >
                                {finished.length > 0 ? 'Continue learning' : 'Start learning for free'}
                                <span className="flex size-9 items-center justify-center rounded-full bg-ink text-signal transition-transform duration-300 group-hover:rotate-45">
                                    <ArrowUpRight size={17} strokeWidth={2} aria-hidden="true" />
                                </span>
                            </Link>
                        ) : (
                            <span className="inline-flex h-14 items-center gap-2.5 rounded-full border border-signal/60 px-6 text-[15px] font-semibold text-signal">
                                <Check size={17} strokeWidth={2.4} aria-hidden="true" /> You finished everything available
                            </span>
                        )}
                        <span className={`${label} text-paper/75`}>
                            {course.chapters.length} chapters · {total} exercises · {ready.length} ready now
                        </span>
                    </div>
                </div>
            </section>

            <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_340px] items-start gap-8 px-[clamp(20px,4vw,40px)] py-14 max-[980px]:grid-cols-1">
                {/* Chapters */}
                <ol className={`${panel} overflow-hidden`}>
                    {course.chapters.map((chapter, c) => {
                        const open = chapter.id === openId;
                        const done = chapter.exercises.filter((exercise) => isPlayable(exercise) && isDone(exerciseKey(courseId, chapter.id, exercise.id))).length;
                        const complete = chapterDone(chapter);
                        return (
                            <li className="border-b border-paper/10 last:border-b-0" key={chapter.id}>
                                <button
                                    className="flex w-full cursor-pointer items-center gap-5 px-6 py-5 text-left transition-colors duration-180 hover:bg-paper/[0.04] max-[720px]:gap-4 max-[720px]:px-4"
                                    type="button"
                                    aria-expanded={open}
                                    onClick={() => setPickedId(open ? null : chapter.id)}
                                >
                                    <span className={`flex size-11 flex-none items-center justify-center rounded-full border font-plex text-[14px] ${complete ? 'border-signal bg-signal text-ink' : open ? 'border-signal text-signal' : 'border-paper/25 text-paper/70'}`}>
                                        {complete ? <Check size={18} strokeWidth={2.6} aria-hidden="true" /> : c + 1}
                                    </span>
                                    <span className="min-w-0 flex-1">
                                        <span className={`block font-editorial text-[length:clamp(24px,2.6vw,32px)] leading-[1.1] ${open ? 'text-paper' : 'text-paper/80'}`}>{chapter.title}</span>
                                    </span>
                                    <span className={`${label} flex-none text-paper/60`}>{done} / {chapter.exercises.length}</span>
                                    <ChevronDown size={18} strokeWidth={1.8} className={`flex-none text-paper/60 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </button>

                                <div className={`grid transition-[grid-template-rows] duration-500 ease-harbor ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                    <div className="overflow-hidden">
                                        <div className="mx-6 mb-6 rounded-[14px] bg-paper/[0.04] p-5 max-[720px]:mx-4 max-[720px]:p-4">
                                            <p className="text-[15px] leading-[1.55] text-paper/80">{chapter.text}</p>
                                            <ul className="mt-4">
                                                {chapter.exercises.map((exercise, e) => {
                                                    const written = isPlayable(exercise);
                                                    const item = written ? { ...exercise, chapter } : null;
                                                    const isOpen = written && unlocked(item);
                                                    const isFinished = written && isDone(keyOf(item));
                                                    return (
                                                        <li className="flex items-center gap-4 border-t border-paper/10 py-3 first:border-t-0" key={exercise.title}>
                                                            <span className={`${label} w-[92px] flex-none text-paper/55 max-[720px]:w-auto`}>
                                                                <span className="max-[720px]:hidden">Exercise </span>{e + 1}
                                                            </span>
                                                            <span className={`min-w-0 flex-1 text-[15px] ${written ? 'text-paper' : 'text-paper/55'}`}>{exercise.title}</span>
                                                            {!written && <span className={`${label} flex h-9 w-[104px] flex-none items-center justify-center rounded-[9px] border border-dashed border-paper/20 text-paper/45`}>Soon</span>}
                                                            {written && !isOpen && (
                                                                <span className="flex h-9 w-[104px] flex-none items-center justify-center rounded-[9px] border border-paper/15 text-paper/45" title="Finish the exercise before this one to unlock it">
                                                                    <Lock size={14} strokeWidth={1.8} aria-label="Locked" />
                                                                </span>
                                                            )}
                                                            {isOpen && (
                                                                <Link
                                                                    className={`flex h-9 w-[104px] flex-none items-center justify-center gap-1.5 rounded-[9px] text-[13px] font-semibold transition duration-180 ${isFinished ? 'border border-paper/25 text-paper hover:border-paper' : 'bg-signal text-ink hover:bg-signal-soft'}`}
                                                                    to={pathOf(item)}
                                                                >
                                                                    {isFinished ? <><Check size={13} strokeWidth={2.6} aria-hidden="true" /> Review</> : 'Start'}
                                                                </Link>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ol>

                {/* Sidebar */}
                <aside className="flex flex-col gap-5">
                    <div className={`${panel} p-6`}>
                        <div className="flex items-center gap-4">
                            <span className="flex size-12 items-center justify-center rounded-full bg-paper/10 text-paper/80"><User size={22} strokeWidth={1.6} aria-hidden="true" /></span>
                            <div>
                                <div className="text-[16px] font-semibold">Guest learner</div>
                                <div className={`${label} mt-1 text-paper/60`}>Level {1 + Math.floor(xp / 50)}</div>
                            </div>
                        </div>
                        <p className="mt-4 text-[14px] leading-[1.55] text-paper/70">Your progress is saved in this browser.</p>
                        <Link className="mt-4 flex h-11 items-center justify-center rounded-full border border-paper/25 text-[14px] font-semibold transition duration-180 hover:border-signal hover:bg-signal hover:text-ink" to="/signup">
                            Create an account
                        </Link>
                    </div>

                    <div className={`${panel} p-6`}>
                        <h2 className="font-editorial text-[26px] leading-none">Course progress</h2>
                        <div className="mt-5 flex items-center gap-4">
                            <BookOpen size={20} strokeWidth={1.6} className="flex-none text-signal" aria-hidden="true" />
                            <div className="flex-1">
                                <div className="flex justify-between text-[14px]"><span>Exercises</span><span className="font-plex text-[12px] text-paper/70">{finished.length} / {ready.length}</span></div>
                                <Meter value={finished.length} total={ready.length} />
                            </div>
                        </div>
                        <div className="mt-5 flex items-center gap-4">
                            <Zap size={20} strokeWidth={1.6} className="flex-none text-signal" aria-hidden="true" />
                            <div className="flex-1">
                                <div className="flex justify-between text-[14px]"><span>XP earned</span><span className="font-plex text-[12px] text-paper/70">{xp} / {xpTotal}</span></div>
                                <Meter value={xp} total={xpTotal} />
                            </div>
                        </div>
                    </div>

                    <div className={`${panel} p-6`}>
                        <div className="flex items-baseline justify-between">
                            <h2 className="font-editorial text-[26px] leading-none">Chapter badges</h2>
                            <span className="font-plex text-[12px] text-paper/70">{course.chapters.filter(chapterDone).length} / {course.chapters.length}</span>
                        </div>
                        <p className="mt-3 text-[14px] leading-[1.55] text-paper/70">Finish a chapter to earn its badge.</p>
                        <ul className="mt-5 grid grid-cols-4 gap-3">
                            {course.chapters.map((chapter) => {
                                const earned = chapterDone(chapter);
                                return (
                                    <li
                                        className={`flex aspect-square items-center justify-center rounded-[12px] border ${earned ? 'border-signal bg-signal/15 text-signal' : 'border-paper/10 bg-paper/[0.03] text-paper/25'}`}
                                        title={`${chapter.title}${earned ? ' (earned)' : ''}`}
                                        key={chapter.id}
                                    >
                                        <Award size={22} strokeWidth={1.5} aria-label={`${chapter.title} badge${earned ? ', earned' : ', not earned yet'}`} />
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}
