import { calculateEncouragement, goToMenu } from './quiz_common.js';

// Shows one question at a time with immediate feedback, for quizzes too long
// to comfortably review as a single scrolling page (e.g. the 126-question
// black belt quiz).
export class SequentialQuiz {
    constructor(document, title, questions = [], options = {}) {
        this.quizData = questions;
        this.title = title;
        this.onComplete = options.onComplete || null;
        this.quizElements = this.#getQuizElements(document);
        if (options.manageBackButton !== false) {
            this.quizElements.backButton.addEventListener('click', () => {
                goToMenu()
            });
        }
        this.quizElements.resetButton.addEventListener('click', () => {
            this.resetQuiz()
        });
        this.quizElements.title.innerHTML = this.title;
        this.resetQuiz();
    }

    #getQuizElements(doc) {
        return {
            document: doc,
            title: doc.getElementById("title"),
            progress: doc.getElementById("progress"),
            feedback: doc.getElementById("feedback"),
            quiz: doc.getElementById("quiz"),
            resetButton: doc.getElementById("reset"),
            backButton: doc.getElementById("back"),
            results: doc.getElementById("results"),
        };
    }

    resetQuiz() {
        this.currentIndex = 0;
        this.score = 0;
        this.review = [];

        let quizElements = this.quizElements;
        quizElements.feedback.innerHTML = '';
        quizElements.results.innerHTML = '';
        quizElements.quiz.style.display = '';

        this.#renderQuestion();
    }

    #renderQuestion() {
        let quizElements = this.quizElements;

        if (this.currentIndex >= this.quizData.length) {
            this.#showResults();
            return;
        }

        const currentQuestion = this.quizData[this.currentIndex];
        const questionNumber = this.currentIndex + 1;

        quizElements.progress.innerHTML = `Question ${questionNumber} of ${this.quizData.length}`;

        quizElements.quiz.innerHTML = '';

        const questionContainer = document.createElement("div");
        questionContainer.className = "question";

        const questionHeading = document.createElement("h2");
        questionHeading.innerHTML = currentQuestion.question;
        questionContainer.appendChild(questionHeading);

        const optionsContainer = document.createElement("div");
        optionsContainer.className = "options";

        ["a", "b", "c"].forEach((option) => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "answer-option";
            button.innerHTML = currentQuestion[option];
            button.addEventListener('click', () => this.#answerQuestion(option));
            optionsContainer.appendChild(button);
        });

        const dontKnowButton = document.createElement("button");
        dontKnowButton.type = "button";
        dontKnowButton.className = "answer-option dont-know";
        dontKnowButton.innerHTML = "Don't know";
        dontKnowButton.addEventListener('click', () => this.#answerQuestion(null));
        optionsContainer.appendChild(dontKnowButton);

        questionContainer.appendChild(optionsContainer);
        quizElements.quiz.appendChild(questionContainer);
    }

    #answerQuestion(selectedOption) {
        const currentQuestion = this.quizData[this.currentIndex];
        const correctText = currentQuestion[currentQuestion.correct];
        let feedbackHtml;

        if (selectedOption === null) {
            this.review.push({
                question: currentQuestion.question,
                status: "You didn't know this one",
                correctText
            });
            feedbackHtml = `<p class="incorrect"><strong>The meaning of "${currentQuestion.question}" is "${correctText}".</strong></p>`;
        } else if (selectedOption === currentQuestion.correct) {
            this.score++;
            feedbackHtml = `<p class="correct"><strong>Correct.</strong> The meaning of "${currentQuestion.question}" is "${correctText}".</p>`;
        } else {
            this.review.push({
                question: currentQuestion.question,
                status: `You answered "${currentQuestion[selectedOption]}"`,
                correctText
            });
            feedbackHtml = `<p class="incorrect"><strong>Incorrect.</strong> The meaning of "${currentQuestion.question}" is "${correctText}".</p>`;
        }

        feedbackHtml += `<p class="score-tracker">Your score is ${this.score}/${this.currentIndex + 1}</p>`;
        this.quizElements.feedback.innerHTML = feedbackHtml;

        this.currentIndex++;
        this.#renderQuestion();
    }

    #showResults() {
        let quizElements = this.quizElements;
        quizElements.progress.innerHTML = '';
        quizElements.quiz.style.display = 'none';

        let encouragement = calculateEncouragement(this.score, this.quizData.length);
        let resultsHtml = `<p><strong>Final Score:</strong><br>You scored ${this.score} out of ${this.quizData.length}. ${encouragement}</p>`;

        if (this.review.length > 0) {
            resultsHtml += `<p><strong>Questions to review:</strong></p>`;
            this.review.forEach((item) => {
                resultsHtml += `<p><strong>${item.question}:</strong> ${item.status}. Correct answer: <u>${item.correctText}</u></p>`;
            });
        }

        quizElements.results.innerHTML = resultsHtml;

        if (this.onComplete) {
            this.onComplete(this.score, this.quizData.length);
        }
    }
}

// Bump this when the shape of the stored high score value changes. Old,
// differently-versioned entries are simply left orphaned in localStorage
// rather than being misread as the new shape.
const HIGH_SCORE_SCHEMA_VERSION = 1;

// Presents a menu of themed sub-sections (plus a "Full Quiz" option) for a
// large quiz, and runs a SequentialQuiz for whichever the user picks. High
// scores per section are kept in localStorage so they persist between visits.
export class CategoryQuizMenu {
    constructor(document, title, quizData, categories, storageKey) {
        this.document = document;
        this.title = title;
        this.quizData = quizData;
        this.categories = categories;
        this.storageKey = storageKey;
        this.elements = this.#getElements(document);
        this.elements.title.innerHTML = title;
        this.elements.backButton.addEventListener('click', () => {
            goToMenu()
        });
        this.elements.changeCategoryButton.addEventListener('click', () => {
            this.#showMenu()
        });
        this.#showMenu();
    }

    #getElements(doc) {
        return {
            title: doc.getElementById("title"),
            categorySelect: doc.getElementById("category-select"),
            progress: doc.getElementById("progress"),
            feedback: doc.getElementById("feedback"),
            quiz: doc.getElementById("quiz"),
            results: doc.getElementById("results"),
            resetButton: doc.getElementById("reset"),
            changeCategoryButton: doc.getElementById("change-category"),
            backButton: doc.getElementById("back"),
        };
    }

    #highScoreKey(slug) {
        return `${this.storageKey}_v${HIGH_SCORE_SCHEMA_VERSION}_highscore_${slug}`;
    }

    #getHighScore(slug) {
        try {
            const raw = localStorage.getItem(this.#highScoreKey(slug));
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

    #saveHighScore(slug, score, total) {
        const existing = this.#getHighScore(slug);
        if (!existing || score > existing.score) {
            localStorage.setItem(this.#highScoreKey(slug), JSON.stringify({ score, total }));
        }
    }

    #questionsForCategory(slug) {
        return slug === 'full' ? this.quizData : this.quizData.filter((q) => q.category === slug);
    }

    #showMenu() {
        const elements = this.elements;

        elements.progress.innerHTML = '';
        elements.feedback.innerHTML = '';
        elements.quiz.innerHTML = '';
        elements.quiz.style.display = 'none';
        elements.results.innerHTML = '';
        elements.resetButton.style.display = 'none';
        elements.changeCategoryButton.style.display = 'none';

        elements.categorySelect.style.display = '';
        elements.categorySelect.innerHTML = '';

        const intro = document.createElement("p");
        intro.innerHTML = "Choose a section to practise, or take the whole quiz in one go.";
        elements.categorySelect.appendChild(intro);

        const list = document.createElement("div");
        list.className = "category-list";

        [...Object.keys(this.categories), 'full'].forEach((slug) => {
            const isFull = slug === 'full';
            const label = isFull ? 'Full Quiz' : this.categories[slug];
            const count = this.#questionsForCategory(slug).length;
            const highScore = this.#getHighScore(slug);

            const button = document.createElement("button");
            button.type = "button";
            button.className = isFull ? "category-option full-quiz-option" : "category-option";

            let metaText = `${count} question${count === 1 ? '' : 's'}`;
            if (highScore) {
                metaText += ` · High score: ${highScore.score}/${highScore.total}`;
            }

            button.innerHTML = `<span class="category-name">${label}</span><span class="category-meta">${metaText}</span>`;
            button.addEventListener('click', () => this.#startQuiz(slug, label));
            list.appendChild(button);
        });

        elements.categorySelect.appendChild(list);
    }

    #startQuiz(slug, label) {
        const elements = this.elements;

        elements.categorySelect.style.display = 'none';
        elements.quiz.style.display = '';
        elements.resetButton.style.display = '';
        elements.changeCategoryButton.style.display = '';

        // Strip listeners left over from any previously started SequentialQuiz.
        const freshReset = elements.resetButton.cloneNode(true);
        elements.resetButton.replaceWith(freshReset);
        elements.resetButton = freshReset;

        const questions = this.#questionsForCategory(slug);
        const quizTitle = slug === 'full' ? this.title : `${this.title}: ${label}`;

        new SequentialQuiz(this.document, quizTitle, questions, {
            manageBackButton: false,
            onComplete: (score, total) => this.#saveHighScore(slug, score, total),
        });
    }
}