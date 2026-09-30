import { SequentialQuiz } from '../sequential_quiz.js';
import { contentSignature } from '../quiz_common.js';
import { getProgress, saveProgress, saveHighScore } from './CDB_common.js';
import { quizData, categories } from './CDB_data.js';

const STORAGE_KEY = 'cdbQuiz';
const MENU_URL = 'CDB.html';
const BASE_TITLE = 'Cho Dan Bo Terminology Quiz';

const slug = new URLSearchParams(window.location.search).get('category') || 'full';

if (slug !== 'full' && !Object.hasOwn(categories, slug)) {
    // Unknown/stale category (bad link, old bookmark) - send them back to pick one.
    window.location.href = MENU_URL;
} else {
    const label = slug === 'full' ? 'Full Quiz' : categories[slug];
    const questions = slug === 'full' ? quizData : quizData.filter((q) => q.category === slug);
    const title = slug === 'full' ? BASE_TITLE : `${BASE_TITLE}: ${label}`;
    const signature = contentSignature(questions);

    new SequentialQuiz(document, title, questions, {
        menuUrl: MENU_URL,
        resumeFrom: getProgress(STORAGE_KEY, slug, signature),
        onProgress: (state) => saveProgress(STORAGE_KEY, slug, state),
        onComplete: (score, total, finalSignature) => {
            saveHighScore(STORAGE_KEY, slug, score, total, finalSignature);
            saveProgress(STORAGE_KEY, slug, null);
        },
    });
}
