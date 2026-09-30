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
const PROGRESS_SCHEMA_VERSION = 2;

function highScoreKey(storageKey, slug) {
    return `${storageKey}_v${HIGH_SCORE_SCHEMA_VERSION}_highscore_${slug}`;
}

// currentTotal, when given, discards a saved score whose total no longer
// matches the category's current question count - e.g. after questions were
// added/removed, so an old "15/15" can't linger and look like a live result.
export function getHighScore(storageKey, slug, currentTotal) {
    try {
        const raw = localStorage.getItem(highScoreKey(storageKey, slug));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (typeof parsed.score !== 'number' || typeof parsed.total !== 'number') {
            return null;
        }
        if (typeof currentTotal === 'number' && parsed.total !== currentTotal) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

export function saveHighScore(storageKey, slug, score, total) {
    const existing = getHighScore(storageKey, slug, total);
    if (!existing || score > existing.score) {
        try {
            localStorage.setItem(highScoreKey(storageKey, slug), JSON.stringify({ score, total }));
        } catch {
            // Best-effort: storage may be full or unavailable, but the quiz
            // itself keeps working in-memory either way.
        }
    }
}

function progressKey(storageKey, slug) {
    return `${storageKey}_v${PROGRESS_SCHEMA_VERSION}_progress_${slug}`;
}

// currentTotal, when given, discards a checkpoint whose total no longer
// matches the category's current question count - e.g. after questions were
// added, removed or reordered, so a stale checkpoint can't resume into the
// wrong question or a mismatched review list.
export function getProgress(storageKey, slug, currentTotal) {
    try {
        const raw = localStorage.getItem(progressKey(storageKey, slug));
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (
            typeof parsed.currentIndex !== 'number' ||
            typeof parsed.score !== 'number' ||
            typeof parsed.total !== 'number' ||
            !Array.isArray(parsed.review)
        ) {
            return null;
        }
        if (typeof currentTotal === 'number' && parsed.total !== currentTotal) {
            return null;
        }
        return parsed;
    } catch {
        return null;
    }
}

// Pass null to clear the checkpoint (quiz finished or restarted).
export function saveProgress(storageKey, slug, state) {
    try {
        if (state === null) {
            localStorage.removeItem(progressKey(storageKey, slug));
        } else {
            localStorage.setItem(progressKey(storageKey, slug), JSON.stringify(state));
        }
    } catch {
        // Best-effort: a failed checkpoint write shouldn't break the
        // in-memory quiz, it just won't be resumable later.
    }
}

// Wipes every high score and in-progress checkpoint for this quiz. Matches
// on a plain prefix rather than the current schema versions, so it also
// sweeps up any orphaned entries left behind by an older storage format.
export function resetAllData(storageKey) {
    const prefix = `${storageKey}_`;
    Object.keys(localStorage)
        .filter((key) => key.startsWith(prefix))
        .forEach((key) => {
            try {
                localStorage.removeItem(key);
            } catch {
                // Best-effort: keep clearing the remaining keys either way.
            }
        });
}
