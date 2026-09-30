import { SequentialQuiz } from '../cbd_quiz.js';
import { getProgress, saveProgress, saveHighScore } from '../cbd_common.js';
import { quizData, categories } from './CDB_data.js';

const STORAGE_KEY = 'cdbQuiz';
const MENU_URL = 'CDB.html';
const BASE_TITLE = 'Cho Dan Bo Terminology Quiz';

const slug = new URLSearchParams(window.location.search).get('category') || 'full';

if (slug !== 'full' && !categories[slug]) {
    // Unknown/stale category (bad link, old bookmark) - send them back to pick one.
    window.location.href = MENU_URL;
} else {
    const label = slug === 'full' ? 'Full Quiz' : categories[slug];
    const questions = slug === 'full' ? quizData : quizData.filter((q) => q.category === slug);
    const title = slug === 'full' ? BASE_TITLE : `${BASE_TITLE}: ${label}`;

    new SequentialQuiz(document, title, questions, {
        menuUrl: MENU_URL,
        resumeFrom: getProgress(STORAGE_KEY, slug),
        onProgress: (state) => saveProgress(STORAGE_KEY, slug, state),
        onComplete: (score, total) => {
            saveHighScore(STORAGE_KEY, slug, score, total);
            saveProgress(STORAGE_KEY, slug, null);
        },
    });
}
