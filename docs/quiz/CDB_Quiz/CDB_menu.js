import { goToMenu } from '../quiz_common.js';
import { getHighScore, getProgress, resetAllData } from './CDB_common.js';

// Renders a menu of themed sub-sections (plus a "Full Quiz" option) for a
// large quiz. Each option is a real link to quizPageUrl with a ?category=
// query param, rather than swapping content in place - so the menu and the
// quiz itself are two separate pages.
export function renderCategoryMenu(document, title, quizData, categories, storageKey, quizPageUrl) {
    document.getElementById("back").addEventListener('click', () => {
        goToMenu()
    });
    document.getElementById("reset-data").addEventListener('click', () => {
        const confirmed = window.confirm(
            "This will erase your saved high scores and any in-progress quiz for every section. This can't be undone. Continue?"
        );
        if (confirmed) {
            resetAllData(storageKey);
            window.location.reload();
        }
    });
    document.getElementById("title").innerHTML = title;

    const categorySelect = document.getElementById("category-select");
    categorySelect.innerHTML = '';

    const intro = document.createElement("p");
    intro.innerHTML = "Choose a section to practise, or take the whole quiz in one go.";
    categorySelect.appendChild(intro);

    const list = document.createElement("div");
    list.className = "category-list";

    const questionsForCategory = (slug) =>
        slug === 'full' ? quizData : quizData.filter((q) => q.category === slug);

    [...Object.keys(categories), 'full'].forEach((slug) => {
        const isFull = slug === 'full';
        const label = isFull ? 'Full Quiz' : categories[slug];
        const count = questionsForCategory(slug).length;
        const highScore = getHighScore(storageKey, slug, count);
        const progress = getProgress(storageKey, slug, count);

        const button = document.createElement("button");
        button.type = "button";
        button.className = isFull ? "category-option full-quiz-option" : "category-option";

        let metaText = `${count} question${count === 1 ? '' : 's'}`;
        if (progress) {
            metaText += ` · Resume at question ${progress.currentIndex + 1}`;
        }
        if (highScore) {
            metaText += ` · High score: ${highScore.score}/${highScore.total}`;
        }

        // Bottom bar showing the best recorded attempt, sized by flex-grow
        // rather than computed percentages so the split is always exact.
        let scoreBarHtml = '';
        if (highScore) {
            scoreBarHtml = `<span class="score-bar">
                <span class="score-bar-correct" style="flex-grow: ${highScore.score}"></span>
                <span class="score-bar-remaining" style="flex-grow: ${highScore.total - highScore.score}"></span>
            </span>`;
        }

        button.innerHTML = `<span class="category-name">${label}</span><span class="category-meta">${metaText}</span>${scoreBarHtml}`;
        button.addEventListener('click', () => {
            window.location.href = `${quizPageUrl}?category=${encodeURIComponent(slug)}`;
        });
        list.appendChild(button);
    });

    categorySelect.appendChild(list);
}
