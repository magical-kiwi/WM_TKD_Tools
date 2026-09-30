import { goToMenu } from './quiz_common.js';
import { getHighScore, getProgress } from './cbd_common.js';

// Renders a menu of themed sub-sections (plus a "Full Quiz" option) for a
// large quiz. Each option is a real link to quizPageUrl with a ?category=
// query param, rather than swapping content in place - so the menu and the
// quiz itself are two separate pages.
export function renderCategoryMenu(document, title, quizData, categories, storageKey, quizPageUrl) {
    document.getElementById("back").addEventListener('click', () => {
        goToMenu()
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
        const highScore = getHighScore(storageKey, slug);
        const progress = getProgress(storageKey, slug);

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

        button.innerHTML = `<span class="category-name">${label}</span><span class="category-meta">${metaText}</span>`;
        button.addEventListener('click', () => {
            window.location.href = `${quizPageUrl}?category=${encodeURIComponent(slug)}`;
        });
        list.appendChild(button);
    });

    categorySelect.appendChild(list);
}
