import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell, { Field, SubmitButton } from '../components/AuthShell';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ go }) {
    const [form, setForm] = useState({ email: '', password: '', remember: true });
    const [errors, setErrors] = useState({});
    const [busy, setBusy] = useState(false);

    const update = (key) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((current) => ({ ...current, [key]: value }));
        setErrors((current) => ({ ...current, [key]: undefined }));
    };

    const submit = (e) => {
        e.preventDefault();
        const found = {};
        if (!emailPattern.test(form.email.trim())) found.email = 'Enter a valid email address.';
        if (!form.password) found.password = 'Enter your password.';
        setErrors(found);
        if (Object.keys(found).length > 0) return;

        // TODO: there is no sign-in endpoint on the backend yet. Send `form` to it here,
        // show its error on failure, and only continue when it accepts the credentials.
        setBusy(true);
        go?.('roadmap');
    };

    return (
        <AuthShell
            eyebrow="Welcome back"
            title={<>Pick up where <em className="text-ember">you left off.</em></>}
            intro="Sign in to get back to your path, your streak and the project you were in the middle of."
            footer={<>New to Harbor? <Link className="font-semibold text-ink underline decoration-ink/25 underline-offset-[5px] transition-colors hover:decoration-ink" to="/signup">Create an account</Link></>}
            artTitle="The light stays on while you’re away."
            artText="Your lessons, projects and progress are saved exactly where you stopped."
            artPoints={['Saved progress', 'Your projects', 'Your streak']}
        >
            <form className="flex flex-col gap-5" onSubmit={submit} noValidate>
                <Field label="Email" id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update('email')} error={errors.email} />
                <Field
                    label="Password"
                    id="login-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Your password"
                    value={form.password}
                    onChange={update('password')}
                    error={errors.password}
                />
                <label className="flex cursor-pointer items-center gap-3 text-[14px] text-ink/80">
                    <input className="size-[18px] cursor-pointer accent-ink" type="checkbox" checked={form.remember} onChange={update('remember')} />
                    Keep me signed in on this device
                </label>
                <div className="mt-2">
                    <SubmitButton busy={busy}>Sign in</SubmitButton>
                </div>
            </form>
        </AuthShell>
    );
}
