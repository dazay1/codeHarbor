import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import AuthShell, { Field, SubmitButton } from '../components/AuthShell';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const goals = ['Frontend', 'Backend', 'Full-stack', 'Data', 'DevOps', 'Not sure yet'];

// Four simple checks; the meter fills one segment for each that passes.
const passwordChecks = [
    ['8+ characters', (value) => value.length >= 8],
    ['A capital letter', (value) => /[A-Z]/.test(value)],
    ['A number', (value) => /\d/.test(value)],
    ['A symbol', (value) => /[^A-Za-z0-9]/.test(value)],
];
const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export default function Signup({ go }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', goal: '', terms: false });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    const update = (key) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const passed = passwordChecks.filter(([, test]) => test(form.password)).length;

    const submit = (e) => {
        e.preventDefault();
        const found = {};
        if (!form.name.trim()) found.name = 'Tell us what to call you.';
        if (!emailPattern.test(form.email.trim())) found.email = 'Enter a valid email address.';
        if (form.password.length < 8) found.password = 'Use at least 8 characters.';
        if (!form.terms) found.terms = 'Please accept the terms to continue.';
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        // TODO: there is no sign-up endpoint on the backend yet. Send `form` to it here,
        // show its error on failure, and only continue once the account exists.
        setBusy(true);
        go?.('roadmap');
    };

    return (
        <AuthShell
            eyebrow="Create your account"
            title={<>Start building <em className="text-ember">today.</em></>}
            intro="One account for every course, your projects and your progress. It takes less than a minute."
            footer={<>Already have an account? <Link className="font-semibold text-ink underline decoration-ink/25 underline-offset-[5px] transition-colors hover:decoration-ink" to="/login">Sign in</Link></>}
            artTitle="Every builder starts somewhere. Start here."
            artText="Pick a course, write your first lines of code in the browser, and see how far ten minutes can take you."
            artPoints={['No credit card', 'Nothing to install', 'First lesson free']}
        >
            <form className="flex flex-col gap-5" onSubmit={submit} noValidate>
                <Field label="Name" id="signup-name" autoComplete="name" placeholder="Ada Lovelace" value={form.name} onChange={update('name')} error={errors.name} />
                <Field label="Email" id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} />
                <div>
                    <Field
                        label="Password"
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        placeholder="Create a password"
                        value={form.password}
                        onChange={update('password')}
                        error={errors.password}
                        trailing={form.password && <span className="font-plex text-[10px] uppercase tracking-[0.12em] text-ink/60">{strengthLabels[passed]}</span>}
                    />
                    <div className="mt-3 grid grid-cols-4 gap-1.5" aria-hidden="true">
                        {passwordChecks.map(([label], i) => (
                            <span className={`h-1 rounded-full transition-colors duration-300 ${i < passed ? (passed < 2 ? 'bg-ember' : passed < 4 ? 'bg-signal' : 'bg-sage') : 'bg-ink/10'}`} key={label}></span>
                        ))}
                    </div>
                    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[12px]">
                        {passwordChecks.map(([label, test]) => {
                            const ok = test(form.password);
                            return (
                                <li className={`flex items-center gap-1.5 transition-colors duration-300 ${ok ? 'text-[#3f6a4c]' : 'text-ink/50'}`} key={label}>
                                    <Check size={12} strokeWidth={3} aria-hidden="true" /> {label}
                                </li>
                            );
                        })}
                    </ul>
                </div>

                <fieldset>
                    <legend className="font-plex text-[10px] uppercase tracking-[0.14em] text-ink/70">
                        What do you want to become? <span className="normal-case tracking-normal text-ink/45">(optional)</span>
                    </legend>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                        {goals.map((goal) => {
                            const on = form.goal === goal;
                            return (
                                <button
                                    className={`h-10 cursor-pointer rounded-full border px-4 text-[13.5px] transition duration-180 ${on ? 'border-ink bg-ink text-paper' : 'border-ink/15 bg-white text-ink/80 hover:border-ink/40'}`}
                                    type="button"
                                    aria-pressed={on}
                                    key={goal}
                                    onClick={() => setForm((current) => ({ ...current, goal: on ? '' : goal }))}
                                >
                                    {goal}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                <div>
                    <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-[1.5] text-ink/80">
                        <input className="mt-0.5 size-[18px] flex-none cursor-pointer accent-ink" type="checkbox" checked={form.terms} onChange={update('terms')} aria-invalid={Boolean(errors.terms)} />
                        <span>I agree to the Terms and the Privacy Policy.</span>
                    </label>
                    {errors.terms && <p className="mt-2 text-[12.5px] text-ember">{errors.terms}</p>}
                </div>

                <div className="mt-1">
                    <SubmitButton busy={busy}>Create my account</SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
