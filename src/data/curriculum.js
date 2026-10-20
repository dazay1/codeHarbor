// Course content for the course overview and lesson pages.
//
// Each course has chapters; each chapter has exercises. An exercise with `body` is playable:
//   body    - blocks shown on the left: ['p', text] ['h', text] ['code', text] ['list', [..]]
//             (text supports **bold** and `code`)
//   task    - the instruction the learner must carry out
//   starter - what the editor starts with
//   hint    - shown when the learner asks for it
//   check   - receives { code, output, doc, rows, columns } and returns true,
//             or a short message saying what is still missing
// An exercise with only a title is listed in the outline but not written yet.

const lines = (output) => output.split('\n').map((line) => line.trim()).filter(Boolean);
const has = (pattern, message) => ({ code }) => pattern.test(code) || message;

export const XP_PER_EXERCISE = 10;

export const curriculum = {
    python: {
        runner: 'python',
        file: 'script.py',
        tagline: 'Learn programming fundamentals such as variables, control flow and loops with one of the most readable languages there is.',
        chapters: [
            {
                id: 'hello-world',
                title: 'Hello World',
                text: 'Write your first lines of Python by printing messages to the terminal.',
                exercises: [
                    {
                        id: 'setting-up',
                        title: 'Setting Up',
                        body: [
                            ['p', 'Welcome to your first Python lesson. **Python** is a programming language created by Guido van Rossum in the early 1990s. It was designed to be easy to read, which makes it a great first language.'],
                            ['p', 'It is also used almost everywhere:'],
                            ['list', ['Data analysis and visualization', 'Automation and scripting', 'Web development', 'Machine learning']],
                            ['p', 'The code you write in this course lives in a file ending in `.py`. On the right is a **code editor**, where you write code, and a **terminal**, where the results appear.'],
                            ['h', 'Running code'],
                            ['p', 'To show something in the terminal, Python uses `print()`. Whatever you put between the brackets is printed.'],
                            ['code', 'print("Hi")'],
                        ],
                        task: 'Type `print("Hi")` in the editor, press **Run** to see it work, then **Submit answer**.',
                        starter: '# Write code below\n',
                        hint: 'Copy it exactly, including the quotes: print("Hi")',
                        check: ({ output }) => lines(output).includes('Hi') || 'The terminal should show the word Hi.',
                    },
                    {
                        id: 'hello-world',
                        title: 'Hello World',
                        body: [
                            ['p', 'It is a tradition: the first program in any new language prints **Hello, World!**'],
                            ['p', 'Text in Python is called a **string**. A string always sits inside quotes, either `"double"` or `\'single\'`.'],
                            ['code', 'print("I am a string")'],
                            ['p', 'Without the quotes, Python would think the words are names of things it should already know, and stop with an error.'],
                        ],
                        task: 'Print `Hello, World!` exactly, with the comma and the exclamation mark.',
                        starter: '# Write code below\n',
                        hint: 'print("Hello, World!")',
                        check: ({ output }) => lines(output).includes('Hello, World!') || 'The terminal should show Hello, World! exactly.',
                    },
                    {
                        id: 'pattern',
                        title: 'Pattern',
                        body: [
                            ['p', 'A program runs **top to bottom**, one line at a time. Each `print()` starts a new line in the terminal.'],
                            ['code', 'print("first")\nprint("second")'],
                            ['p', 'That means you can draw with text, one row per `print()`.'],
                        ],
                        task: 'Use four `print()` lines to draw this staircase:\n*\n**\n***\n****',
                        starter: '# Write code below\n',
                        hint: 'The first line is print("*"), the second is print("**"), and so on.',
                        check: ({ output }) => lines(output).join('|') === '*|**|***|****' || 'The terminal should show four rows: 1, 2, 3 and 4 stars.',
                    },
                    {
                        id: 'postcard',
                        title: 'Postcard',
                        body: [
                            ['p', 'Lines that start with `#` are **comments**. Python ignores them; they are notes for people.'],
                            ['code', '# This line does nothing\nprint("This line prints")'],
                            ['p', 'An empty `print()` prints a blank line, which is handy for spacing.'],
                        ],
                        task: 'Write a short postcard to a friend: at least three `print()` lines of text, with one comment above them saying who it is for.',
                        starter: '# Write code below\n',
                        hint: 'Start with a comment like # To: Sam, then three print("...") lines.',
                        check: ({ code, output }) => {
                            if ((code.match(/^\s*#.+/gm) || []).filter((line) => !/Write code below/.test(line)).length < 1) return 'Add a comment of your own saying who the postcard is for.';
                            return lines(output).length >= 3 || 'Print at least three lines of text.';
                        },
                    },
                ],
            },
            { id: 'variables', title: 'Variables', text: 'Store numbers and text, and do maths with them.', exercises: [{ title: 'Naming things' }, { title: 'Numbers' }, { title: 'Text maths' }, { title: 'Tip calculator' }] },
            { id: 'control-flow', title: 'Control Flow', text: 'Teach your program to make decisions.', exercises: [{ title: 'True and False' }, { title: 'If' }, { title: 'Else and elif' }, { title: 'Magic 8 ball' }] },
            { id: 'loops', title: 'Loops', text: 'Repeat work without repeating yourself.', exercises: [{ title: 'While' }, { title: 'For' }, { title: 'Range' }, { title: 'Countdown' }] },
            { id: 'lists', title: 'Lists', text: 'Keep many values together and work through them.', exercises: [{ title: 'Making a list' }, { title: 'Indexes' }, { title: 'Adding and removing' }, { title: 'Reading list' }] },
            { id: 'functions', title: 'Functions', text: 'Package code so you can use it again.', exercises: [{ title: 'Define and call' }, { title: 'Parameters' }, { title: 'Return' }, { title: 'Final project' }] },
        ],
    },

    html: {
        runner: 'web',
        file: 'index.html',
        tagline: 'Create your first website with HTML, the language that gives every page its structure.',
        chapters: [
            {
                id: 'page-basics',
                title: 'Page Basics',
                text: 'Put your first words on a web page.',
                exercises: [
                    {
                        id: 'first-heading',
                        title: 'First Heading',
                        body: [
                            ['p', '**HTML** describes what is on a page. It does that with **elements**: a piece of content wrapped in an opening and a closing **tag**.'],
                            ['code', '<h1>My heading</h1>'],
                            ['p', '`<h1>` opens the element, `</h1>` closes it, and the text in between is what people see. `h1` means the most important heading on the page.'],
                            ['p', 'The editor is on the right. Press **Run** and your page appears in the preview below it.'],
                        ],
                        task: 'Add an `<h1>` heading with any text you like.',
                        starter: '<!-- Write your HTML below -->\n',
                        hint: '<h1>Hello, web!</h1>',
                        check: ({ doc }) => Boolean(doc.querySelector('h1')?.textContent.trim()) || 'Add an <h1> element with some text inside it.',
                    },
                    {
                        id: 'paragraphs',
                        title: 'Paragraphs',
                        body: [
                            ['p', 'Ordinary text goes in a **paragraph**, written with `<p>`.'],
                            ['code', '<h1>Tea</h1>\n<p>Tea is a drink made from leaves.</p>'],
                            ['p', 'Browsers ignore line breaks in your file, so each new paragraph needs its own `<p>` element.'],
                        ],
                        task: 'Write a heading about a hobby of yours, followed by two paragraphs about it.',
                        starter: '<!-- Write your HTML below -->\n',
                        hint: 'One <h1>, then <p>...</p> twice.',
                        check: ({ doc }) => {
                            if (!doc.querySelector('h1')?.textContent.trim()) return 'Start with an <h1> heading.';
                            return [...doc.querySelectorAll('p')].filter((p) => p.textContent.trim()).length >= 2 || 'Add two <p> paragraphs with text in them.';
                        },
                    },
                    {
                        id: 'links',
                        title: 'Links',
                        body: [
                            ['p', 'The web is a web because pages **link** to each other. A link is an `<a>` element.'],
                            ['code', '<a href="https://example.com">Visit the example</a>'],
                            ['p', '`href` is an **attribute**: extra information written inside the opening tag. Here it says where the link goes.'],
                        ],
                        task: 'Add a link with an `href` and some link text.',
                        starter: '<h1>My favourite places</h1>\n<p>Here is one of them:</p>\n',
                        hint: '<a href="https://example.com">Example</a>',
                        check: ({ doc }) => {
                            const link = doc.querySelector('a[href]');
                            if (!link || !link.getAttribute('href').trim()) return 'Add an <a> element with an href attribute.';
                            return Boolean(link.textContent.trim()) || 'Put some text inside the link so there is something to click.';
                        },
                    },
                ],
            },
            { id: 'text', title: 'Text and Lists', text: 'Headings, emphasis and lists that give text a shape.', exercises: [{ title: 'Heading levels' }, { title: 'Bold and italic' }, { title: 'Lists' }, { title: 'Recipe page' }] },
            { id: 'media', title: 'Images and Media', text: 'Bring pictures onto the page.', exercises: [{ title: 'Images' }, { title: 'Alt text' }, { title: 'Figures' }] },
            { id: 'forms', title: 'Forms', text: 'Let people type things in.', exercises: [{ title: 'Inputs' }, { title: 'Labels' }, { title: 'Buttons' }, { title: 'Sign-up form' }] },
            { id: 'structure', title: 'Page Structure', text: 'Header, main, footer: the skeleton of a real site.', exercises: [{ title: 'Semantic elements' }, { title: 'Navigation' }, { title: 'Final project' }] },
        ],
    },

    css: {
        runner: 'web',
        file: 'styles.css',
        // The learner edits CSS; this fixed page is what it styles.
        html: '<h1>Mountain Tea</h1>\n<p>Small-batch tea, picked by hand.</p>\n<div class="card">\n  <h2>Today\'s pick</h2>\n  <p>Green jasmine, lightly sweet.</p>\n</div>',
        tagline: 'Use selectors, layout and color to style your pages and make them yours.',
        chapters: [
            {
                id: 'first-styles',
                title: 'First Styles',
                text: 'Change how a page looks with your first rules.',
                exercises: [
                    {
                        id: 'first-rule',
                        title: 'Your First Rule',
                        body: [
                            ['p', 'HTML says what is on the page. **CSS** says how it looks. CSS is made of **rules**.'],
                            ['code', 'p {\n  color: gray;\n}'],
                            ['p', '`p` is the **selector**: which elements to style. Inside the braces, `color` is a **property** and `gray` is its **value**. Each line ends with a semicolon.'],
                            ['p', 'The page you are styling is already written. Press **Run** to see it, then change it.'],
                        ],
                        task: 'Write a rule that gives the `h1` a `color` of your choice.',
                        starter: '/* Write your CSS below */\n',
                        hint: 'h1 {\n  color: teal;\n}',
                        check: has(/h1\s*\{[^}]*\bcolor\s*:\s*[^;}\s]+/i, 'Add a rule for h1 with a color inside its braces.'),
                    },
                    {
                        id: 'classes',
                        title: 'Classes',
                        body: [
                            ['p', 'Sometimes you want to style one particular element, not every `p`. Give it a **class** in the HTML and select it with a dot.'],
                            ['code', '.card {\n  background-color: lightyellow;\n}'],
                            ['p', 'The page has a `<div class="card">`. The selector `.card` matches it.'],
                        ],
                        task: 'Give the `.card` a `background-color`.',
                        starter: 'h1 {\n  color: teal;\n}\n\n/* Write your CSS below */\n',
                        hint: '.card {\n  background-color: #eef7f0;\n}',
                        check: has(/\.card\s*\{[^}]*\bbackground(-color)?\s*:\s*[^;}\s]+/i, 'Add a .card rule with a background-color.'),
                    },
                    {
                        id: 'spacing',
                        title: 'Spacing',
                        body: [
                            ['p', 'Right now the text touches the edge of the card. **Padding** adds space inside an element, between its edge and its content.'],
                            ['code', '.card {\n  padding: 20px;\n}'],
                            ['p', '`border-radius` rounds the corners, which pairs nicely with padding.'],
                        ],
                        task: 'Add `padding` and a `border-radius` to the `.card`.',
                        starter: 'h1 {\n  color: teal;\n}\n\n.card {\n  background-color: #eef7f0;\n}\n',
                        hint: 'Inside .card add padding: 20px; and border-radius: 12px;',
                        check: ({ code }) => {
                            const card = (code.match(/\.card\s*\{[^}]*\}/gi) || []).join(' ');
                            if (!/\bpadding\s*:\s*[^;}\s]+/i.test(card)) return 'Add padding inside the .card rule.';
                            return /\bborder-radius\s*:\s*[^;}\s]+/i.test(card) || 'Add a border-radius inside the .card rule.';
                        },
                    },
                ],
            },
            { id: 'text', title: 'Type and Color', text: 'Fonts, sizes and colors that are easy to read.', exercises: [{ title: 'Font family' }, { title: 'Sizes' }, { title: 'Color values' }, { title: 'Article page' }] },
            { id: 'box', title: 'The Box Model', text: 'Margin, border, padding: how elements take up space.', exercises: [{ title: 'Margin' }, { title: 'Borders' }, { title: 'Width and height' }] },
            { id: 'flexbox', title: 'Flexbox', text: 'Line things up in rows and columns.', exercises: [{ title: 'Rows' }, { title: 'Alignment' }, { title: 'Gaps' }, { title: 'Nav bar' }] },
            { id: 'responsive', title: 'Responsive Design', text: 'One page that works on every screen.', exercises: [{ title: 'Media queries' }, { title: 'Flexible sizes' }, { title: 'Final project' }] },
        ],
    },

    javascript: {
        runner: 'js',
        file: 'script.js',
        tagline: 'Learn variables, loops, functions and events to build websites that respond to people.',
        chapters: [
            {
                id: 'first-steps',
                title: 'First Steps',
                text: 'Run your first JavaScript and see what it prints.',
                exercises: [
                    {
                        id: 'hello-console',
                        title: 'Hello, Console',
                        body: [
                            ['p', '**JavaScript** is the language that makes web pages do things. Every browser can run it.'],
                            ['p', 'The simplest thing a program can do is show a message. In JavaScript that is `console.log()`.'],
                            ['code', 'console.log("Hi");'],
                            ['p', 'Text goes in quotes and is called a **string**. Press **Run** and the message appears in the terminal on the right.'],
                        ],
                        task: 'Log `Hello, World!` to the console.',
                        starter: '// Write code below\n',
                        hint: 'console.log("Hello, World!");',
                        check: ({ output }) => lines(output).includes('Hello, World!') || 'The terminal should show Hello, World! exactly.',
                    },
                    {
                        id: 'variables',
                        title: 'Variables',
                        body: [
                            ['p', 'A **variable** is a name for a value, so you can use it again later.'],
                            ['code', 'let city = "Lisbon";\nconsole.log(city);'],
                            ['p', '`let` creates the variable, `=` puts a value in it. You can join strings with `+`.'],
                            ['code', 'console.log("I live in " + city);'],
                        ],
                        task: 'Create a variable called `name` holding your name, then log `Hi, ` followed by it.',
                        starter: '// Write code below\n',
                        hint: 'let name = "Sam";\nconsole.log("Hi, " + name);',
                        check: ({ code, output }) => {
                            if (!/\b(let|const)\s+name\s*=/.test(code)) return 'Create a variable called name with let.';
                            return lines(output).some((line) => /^Hi, \S+/.test(line)) || 'Log a line that starts with "Hi, " followed by the name.';
                        },
                    },
                    {
                        id: 'numbers',
                        title: 'Numbers',
                        body: [
                            ['p', 'Numbers are written without quotes, and JavaScript can do maths with them: `+`, `-`, `*` for times and `/` for divide.'],
                            ['code', 'let bill = 20;\nconsole.log(bill * 2);'],
                            ['p', 'A 15% tip is the bill times `0.15`.'],
                        ],
                        task: 'The bill is `40`. Work out a 15% tip with code and log the result.',
                        starter: 'let bill = 40;\n\n// Write code below\n',
                        hint: 'console.log(bill * 0.15);',
                        check: ({ code, output }) => {
                            if (!/bill\s*\*|\*\s*bill/.test(code)) return 'Calculate the tip from the bill variable instead of typing the answer.';
                            return lines(output).includes('6') || 'The terminal should show 6.';
                        },
                    },
                ],
            },
            { id: 'decisions', title: 'Making Decisions', text: 'Compare values and choose what happens next.', exercises: [{ title: 'Booleans' }, { title: 'If and else' }, { title: 'Comparisons' }, { title: 'Ticket price' }] },
            { id: 'loops', title: 'Loops', text: 'Do something many times.', exercises: [{ title: 'For loops' }, { title: 'While loops' }, { title: 'Countdown' }] },
            { id: 'functions', title: 'Functions', text: 'Name a piece of code and reuse it.', exercises: [{ title: 'Declaring' }, { title: 'Parameters' }, { title: 'Return values' }, { title: 'Dice roller' }] },
            { id: 'dom', title: 'The Page', text: 'Change a web page and react to clicks.', exercises: [{ title: 'Selecting elements' }, { title: 'Changing text' }, { title: 'Events' }, { title: 'Final project' }] },
        ],
    },

    sql: {
        runner: 'sql',
        file: 'query.sql',
        tagline: 'Learn database basics, queries and calculations to start working with data.',
        chapters: [
            {
                id: 'queries',
                title: 'First Queries',
                text: 'Ask a database for exactly the rows and columns you want.',
                exercises: [
                    {
                        id: 'select-all',
                        title: 'Select Everything',
                        body: [
                            ['p', 'A **database** stores information in **tables**, like a spreadsheet: columns across the top, one row per item.'],
                            ['p', 'You are working with a table called `books`. It has four columns: `id`, `title`, `author` and `year`.'],
                            ['p', '**SQL** is the language for asking a database questions. A question is called a **query**.'],
                            ['code', 'SELECT * FROM books;'],
                            ['p', '`SELECT` says what you want, `*` means every column, and `FROM books` says which table.'],
                        ],
                        task: 'Select every column from the `books` table.',
                        starter: '-- Write your query below\n',
                        hint: 'SELECT * FROM books;',
                        check: ({ rows, columns }) => (columns.length === 4 && rows.length === 6) || 'The result should have all four columns and all six books.',
                    },
                    {
                        id: 'columns',
                        title: 'Choosing Columns',
                        body: [
                            ['p', 'You rarely need every column. List the ones you want, separated by commas.'],
                            ['code', 'SELECT title FROM books;'],
                            ['p', 'The columns come back in the order you ask for them.'],
                        ],
                        task: 'Select only the `title` and `author` of every book, in that order.',
                        starter: '-- Write your query below\n',
                        hint: 'SELECT title, author FROM books;',
                        check: ({ rows, columns }) => (columns.join(',').toLowerCase() === 'title,author' && rows.length === 6) || 'The result should have exactly two columns, title then author, for all six books.',
                    },
                    {
                        id: 'where',
                        title: 'Filtering Rows',
                        body: [
                            ['p', '`WHERE` keeps only the rows that pass a test.'],
                            ['code', 'SELECT title FROM books\nWHERE year < 1900;'],
                            ['p', 'You can compare with `=`, `<`, `>`, `<=` and `>=`.'],
                        ],
                        task: 'Select the `title` and `year` of the books published after 1950.',
                        starter: '-- Write your query below\n',
                        hint: 'SELECT title, year FROM books WHERE year > 1950;',
                        check: ({ rows, columns }) => {
                            if (columns.join(',').toLowerCase() !== 'title,year') return 'Select the title and year columns.';
                            return (rows.length === 3 && rows.every((row) => Number(row[1]) > 1950)) || 'Only the three books published after 1950 should come back.';
                        },
                    },
                ],
            },
            { id: 'sorting', title: 'Sorting and Limiting', text: 'Put results in order and take just the top few.', exercises: [{ title: 'Order by' }, { title: 'Descending' }, { title: 'Limit' }] },
            { id: 'aggregates', title: 'Counting and Totals', text: 'Summarise many rows into one answer.', exercises: [{ title: 'Count' }, { title: 'Sum and average' }, { title: 'Group by' }, { title: 'Sales report' }] },
            { id: 'joins', title: 'Joining Tables', text: 'Combine information that lives in different tables.', exercises: [{ title: 'Two tables' }, { title: 'Inner join' }, { title: 'Left join' }, { title: 'Final project' }] },
        ],
    },

    git: {
        runner: 'git',
        file: 'terminal',
        tagline: 'Save your work, try ideas on branches and collaborate without fear.',
        chapters: [
            {
                id: 'first-commit',
                title: 'Your First Commit',
                text: 'Turn a folder into a project with a saved history.',
                exercises: [
                    {
                        id: 'init',
                        title: 'Starting a Repository',
                        body: [
                            ['p', '**Git** keeps a history of your project, so you can always go back to a version that worked.'],
                            ['p', 'A project tracked by Git is called a **repository**. You create one by running a command inside the project folder.'],
                            ['code', 'git init'],
                            ['p', 'Here you type commands in the editor, one per line, and press **Run**. This is a practice terminal: it understands the Git commands taught in this chapter.'],
                            ['p', '`git status` tells you what Git currently sees. It is the command you will use most.'],
                        ],
                        task: 'Create a repository with `git init`, then check on it with `git status`.',
                        starter: '# One command per line\n',
                        hint: 'git init\ngit status',
                        check: ({ code }) => {
                            if (!/^\s*git\s+init\b/m.test(code)) return 'Run git init first.';
                            return /^\s*git\s+status\b/m.test(code) || 'Add git status on the next line.';
                        },
                    },
                    {
                        id: 'add',
                        title: 'Staging a File',
                        body: [
                            ['p', 'Your folder has one file, `index.html`. Git can see it but is not tracking it yet.'],
                            ['p', 'Saving in Git takes two steps. First you **stage** the changes you want to save.'],
                            ['code', 'git add index.html'],
                            ['p', 'Run `git status` afterwards and the file moves to "Changes to be committed".'],
                        ],
                        task: 'Start a repository, stage `index.html`, then run `git status` to confirm it is staged.',
                        starter: '# One command per line\ngit init\n',
                        hint: 'git init\ngit add index.html\ngit status',
                        check: ({ code, output }) => {
                            if (!/^\s*git\s+add\s+(index\.html|\.|-A|--all)\s*$/m.test(code)) return 'Stage the file with git add index.html.';
                            return /Changes to be committed/.test(output) || 'Run git status after git add to see the staged file.';
                        },
                    },
                    {
                        id: 'commit',
                        title: 'Committing',
                        body: [
                            ['p', 'The second step is the **commit**: a saved point in your history, with a message describing what changed.'],
                            ['code', 'git commit -m "Add home page"'],
                            ['p', 'The message is for future you. Say what the change does, in a few words.'],
                        ],
                        task: 'Start a repository, stage `index.html` and commit it with a message of your own.',
                        starter: '# One command per line\ngit init\ngit add index.html\n',
                        hint: 'Add a third line: git commit -m "Add home page"',
                        check: ({ output }) => /\[main \(root-commit\) [0-9a-f]{7}\]/.test(output) || 'Make a commit with git commit -m "your message" after staging the file.',
                    },
                ],
            },
            { id: 'history', title: 'Reading History', text: 'See what changed, and when.', exercises: [{ title: 'Log' }, { title: 'Diff' }, { title: 'Undoing changes' }] },
            { id: 'branches', title: 'Branches', text: 'Try an idea without touching the working version.', exercises: [{ title: 'Creating a branch' }, { title: 'Switching' }, { title: 'Merging' }, { title: 'Merge conflicts' }] },
            { id: 'github', title: 'GitHub', text: 'Put your work online and work with other people.', exercises: [{ title: 'Remotes' }, { title: 'Push and pull' }, { title: 'Pull requests' }, { title: 'Final project' }] },
        ],
    },
};

// Whether an exercise has content to play: a written coding exercise, or a quiz lesson from the database.
export const isPlayable = (exercise) => Boolean(exercise.body || exercise.kind === 'quiz');
export const xpOf = (exercise) => exercise.xp ?? XP_PER_EXERCISE;

// The exercises of a course that can actually be played, in order, each with its chapter.
export function playableOf(course) {
    if (!course) return [];
    return course.chapters.flatMap((chapter) => chapter.exercises.filter(isPlayable).map((exercise) => ({ ...exercise, chapter })));
}

export const playable = (courseId) => playableOf(curriculum[courseId]);

export const exerciseKey = (courseId, chapterId, exerciseId) => `${courseId}/${chapterId}/${exerciseId}`;
