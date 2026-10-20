import { useCallback, useEffect, useState } from 'react';

// Finished exercises are remembered in this browser only (there are no accounts yet).
const STORAGE_KEY = 'harbor-progress';

function read() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(saved) ? saved : [];
    } catch {
        return [];
    }
}

export function useProgress() {
    const [done, setDone] = useState(read);

    // Keep several open tabs in step with each other.
    useEffect(() => {
        const sync = (event) => event.key === STORAGE_KEY && setDone(read());
        window.addEventListener('storage', sync);
        return () => window.removeEventListener('storage', sync);
    }, []);

    const complete = useCallback((key) => {
        setDone((current) => {
            if (current.includes(key)) return current;
            const next = [...current, key];
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            } catch {
                // Storage can be unavailable (private mode); progress then lasts for this visit only.
            }
            return next;
        });
    }, []);

    return { done, complete, isDone: (key) => done.includes(key) };
}
