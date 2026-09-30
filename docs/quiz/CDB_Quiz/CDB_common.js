// Persistence shared by the CDB quiz's menu page (which reads this to show
// "High score"/"Resume" on each category button) and its quiz page (which
// writes it as the user answers). Kept separate from both CDB_menu.js and
// sequential_quiz.js since it belongs to neither one specifically.

// Bump this when the shape of the stored high score value changes. Old,
// differently-versioned entries are simply left orphaned in localStorage
// rather than being misread as the new shape.
const HIGH_SCORE_SCHEMA_VERSION = 1;

// Same idea as HIGH_SCORE_SCHEMA_VERSION, but for the separate in-progress
// checkpoint data, since the two can change shape independently.
const PROGRESS_SCHEMA_VERSION = 1;

function highScoreKey(storageKey, slug) {
    return `${storageKey}_v${HIGH_SCORE_SCHEMA_VERSION}_highscore_${slug}`;
}

export function getHighScore(storageKey, slug) {
    try {
        const raw = localStorage.getItem(highScoreKey(storageKey, slug));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed.score !== 'number' || typeof parsed.total !== 'number') {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

export function saveHighScore(storageKey, slug, score, total) {
    const existing = getHighScore(storageKey, slug);
    if (!existing || score > existing.score) {
        localStorage.setItem(highScoreKey(storageKey, slug), JSON.stringify({ score, total }));
    }
}

function progressKey(storageKey, slug) {
    return `${storageKey}_v${PROGRESS_SCHEMA_VERSION}_progress_${slug}`;
}

export function getProgress(storageKey, slug) {
    try {
        const raw = localStorage.getItem(progressKey(storageKey, slug));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed.currentIndex !== 'number' || typeof parsed.score !== 'number') {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

// Pass null to clear the checkpoint (quiz finished or restarted).
export function saveProgress(storageKey, slug, state) {
    if (state === null) {
        localStorage.removeItem(progressKey(storageKey, slug));
    } else {
        localStorage.setItem(progressKey(storageKey, slug), JSON.stringify(state));
    }
}
