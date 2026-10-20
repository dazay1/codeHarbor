// Runs a learner's code for each kind of course and returns what to show.
// Every runner resolves to { output, error?, html?, rows?, columns? } and never throws.

const PYODIDE_URL = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';
const SQLJS_URL = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/';

const scripts = {};
function loadScript(src) {
    scripts[src] ??= new Promise((resolve, reject) => {
        const tag = document.createElement('script');
        tag.src = src;
        tag.onload = resolve;
        tag.onerror = () => {
            delete scripts[src];
            tag.remove();
            reject(new Error(`Could not load ${src}`));
        };
        document.head.appendChild(tag);
    });
    return scripts[src];
}

// --- JavaScript: runs in a worker so an endless loop can be stopped ---------------------
function runJs(code) {
    return new Promise((resolve) => {
        const source = `
            const show = (value) => {
                if (typeof value === 'string') return value;
                try { const text = JSON.stringify(value); return text === undefined ? String(value) : text; } catch { return String(value); }
            };
            const log = (...args) => postMessage({ type: 'log', text: args.map(show).join(' ') });
            console.log = console.info = console.warn = console.error = log;
            try { (0, eval)(${JSON.stringify(code)}); postMessage({ type: 'done' }); }
            catch (error) { postMessage({ type: 'done', error: error.name + ': ' + error.message }); }
        `;
        const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
        const worker = new Worker(url);
        const printed = [];
        const finish = (error) => {
            clearTimeout(timer);
            worker.terminate();
            URL.revokeObjectURL(url);
            resolve({ output: printed.join('\n'), error });
        };
        const timer = setTimeout(() => finish('Stopped: the code ran for more than 3 seconds. Is there a loop that never ends?'), 3000);
        worker.onmessage = ({ data }) => (data.type === 'log' ? printed.push(data.text) : finish(data.error));
        worker.onerror = (event) => {
            event.preventDefault();
            finish(event.message || 'The code could not be run.');
        };
    });
}

// --- Python: Pyodide, downloaded the first time it is needed ---------------------------
let pyodide;
async function runPython(code) {
    let py;
    try {
        pyodide ??= loadScript(`${PYODIDE_URL}pyodide.js`).then(() => window.loadPyodide({ indexURL: PYODIDE_URL }));
        py = await pyodide;
    } catch {
        pyodide = undefined;
        return { output: '', error: 'Python could not be loaded. Check your internet connection and press Run again.' };
    }
    const printed = [];
    py.setStdout({ batched: (line) => printed.push(line) });
    py.setStderr({ batched: () => {} });
    // A fresh namespace each run, so variables from the last run do not leak into this one.
    const scope = py.globals.get('dict')();
    try {
        await py.runPythonAsync(code, { globals: scope });
        return { output: printed.join('\n') };
    } catch (error) {
        const message = String(error.message || error).trim().split('\n').filter(Boolean).pop();
        return { output: printed.join('\n'), error: message };
    } finally {
        scope.destroy();
    }
}

// --- SQL: sql.js with a small sample table, rebuilt on every run -------------------------
const SEED = `
    CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT, author TEXT, year INTEGER);
    INSERT INTO books (id, title, author, year) VALUES
        (1, 'Emma', 'Jane Austen', 1815),
        (2, 'Frankenstein', 'Mary Shelley', 1818),
        (3, 'The Hobbit', 'J.R.R. Tolkien', 1937),
        (4, 'Dune', 'Frank Herbert', 1965),
        (5, 'Neuromancer', 'William Gibson', 1984),
        (6, 'Beloved', 'Toni Morrison', 1987);
`;
let sqlite;
async function runSql(code) {
    let SQL;
    try {
        sqlite ??= loadScript(`${SQLJS_URL}sql-wasm.js`).then(() => window.initSqlJs({ locateFile: (file) => SQLJS_URL + file }));
        SQL = await sqlite;
    } catch {
        sqlite = undefined;
        return { output: '', error: 'The database could not be loaded. Check your internet connection and press Run again.', rows: [], columns: [] };
    }
    const db = new SQL.Database();
    try {
        db.run(SEED);
        const results = db.exec(code);
        const last = results[results.length - 1];
        if (!last) return { output: 'The query ran, but returned no rows.', rows: [], columns: [] };
        return { output: `${last.values.length} row${last.values.length === 1 ? '' : 's'}`, rows: last.values, columns: last.columns };
    } catch (error) {
        return { output: '', error: String(error.message || error), rows: [], columns: [] };
    } finally {
        db.close();
    }
}

// --- HTML and CSS: nothing to execute, the result is a page to preview -------------------
function runWeb(code, course) {
    const html = course.html ?? code;
    const css = course.html ? code : '';
    const page = `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;margin:20px;color:#12141a;line-height:1.5}${css.replace(/<\/style/gi, '')}</style></head><body>${html}</body></html>`;
    return { output: '', html: page, doc: new DOMParser().parseFromString(html, 'text/html') };
}

// --- Git: a practice terminal that understands the commands the first chapter teaches ---
function runGit(code) {
    const state = { repo: false, file: 'untracked', commits: [] };
    const printed = [];
    const hashOf = (text) => {
        let h = 7;
        for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
        return h.toString(16).padStart(7, '0').slice(0, 7);
    };
    const status = () => {
        if (state.file === 'committed') return 'On branch main\nnothing to commit, working tree clean';
        if (state.file === 'staged') return 'On branch main\n\nNo commits yet\n\nChanges to be committed:\n  (use "git rm --cached <file>..." to unstage)\n\tnew file:   index.html';
        return 'On branch main\n\nNo commits yet\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\tindex.html\n\nnothing added to commit but untracked files present (use "git add" to track)';
    };
    const answer = (line) => {
        const [tool, sub, ...rest] = line.split(/\s+/);
        if (tool !== 'git') return `command not found: ${tool}`;
        if (sub === 'init') {
            state.repo = true;
            return 'Initialized empty Git repository in /home/you/project/.git/';
        }
        if (!state.repo) return 'fatal: not a git repository (or any of the parent directories): .git';
        if (sub === 'status') return status();
        if (sub === 'add') {
            const target = rest[0];
            if (!target) return 'Nothing specified, nothing added.';
            if (!['index.html', '.', '-A', '--all'].includes(target)) return `fatal: pathspec '${target}' did not match any files`;
            if (state.file === 'untracked') state.file = 'staged';
            return '';
        }
        if (sub === 'commit') {
            const message = line.match(/-m\s+(["'])(.+?)\1/)?.[2];
            if (!message) return 'This practice terminal needs a message: git commit -m "your message"';
            if (state.file !== 'staged') return state.file === 'committed' ? status() : 'On branch main\n\nInitial commit\n\nUntracked files:\n\tindex.html\n\nnothing added to commit but untracked files present';
            const hash = hashOf(message);
            state.file = 'committed';
            state.commits.unshift({ hash, message });
            return `[main (root-commit) ${hash}] ${message}\n 1 file changed, 1 insertion(+)\n create mode 100644 index.html`;
        }
        if (sub === 'log') {
            if (state.commits.length === 0) return "fatal: your current branch 'main' does not have any commits yet";
            return state.commits.map(({ hash, message }) => (rest.includes('--oneline') ? `${hash} ${message}` : `commit ${hash}\n\n    ${message}`)).join('\n\n');
        }
        return `git: '${sub ?? ''}' is not a command this practice terminal knows yet.`;
    };
    code.split('\n').map((line) => line.trim()).filter((line) => line && !line.startsWith('#')).forEach((line) => {
        printed.push(`$ ${line}`);
        const reply = answer(line);
        if (reply) printed.push(reply);
        printed.push('');
    });
    return { output: printed.join('\n').trim() };
}

export async function run(course, code) {
    try {
        if (course.runner === 'js') return await runJs(code);
        if (course.runner === 'python') return await runPython(code);
        if (course.runner === 'sql') return await runSql(code);
        if (course.runner === 'git') return runGit(code);
        return runWeb(code, course);
    } catch (error) {
        return { output: '', error: String(error.message || error) };
    }
}
