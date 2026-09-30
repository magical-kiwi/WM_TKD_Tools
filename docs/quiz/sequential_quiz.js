import { calculateEncouragement, goToMenu } from './quiz_common.js';

// Shows one question at a time with immediate feedback. Owns a whole page:
// the back button always leaves for the site menu, and an optional
// "change category" button (shown when options.menuUrl is given) leaves for
// that quiz's own category-picker page.
export class SequentialQuiz {
    constructor(document, title, questions = [], options = {}) {
        this.quizData = questions;
        this.title = title;
        this.onComplete = options.onComplete || null;
        this.onProgress = options.onProgress || null;
        this.quizElements = this.#getQuizElements(document);

        this.quizElements.backButton.addEventListener('click', () => {
            goToMenu()
        });

        if (options.menuUrl) {
            this.quizElements.changeCategoryButton.addEventListener('click', () => {
                window.location.href = options.menuUrl;
            });
        } else {
            this.quizElements.changeCategoryButton.style.display = 'none';
        }

        this.quizElements.resetButton.addEventListener('click', () => {
            this.resetQuiz()
        });
        this.quizElements.title.innerHTML = this.title;

        const resumeFrom = options.resumeFrom;
        if (resumeFrom && resumeFrom.currentIndex > 0 && resumeFrom.currentIndex < this.quizData.length) {
            this.#startFrom(resumeFrom.currentIndex, resumeFrom.score);
        } else {
            this.resetQuiz();
        }
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
            changeCategoryButton: doc.getElementById("change-category"),
            results: doc.getElementById("results"),
        };
    }

    resetQuiz() {
        this.#startFrom(0, 0);
        if (this.onProgress) {
            this.onProgress(null);
        }
    }

    #startFrom(currentIndex, score) {
        this.currentIndex = currentIndex;
        this.score = score;
        this.review = [];

        let quizElements = this.quizElements;
        // Placeholder occupies the same space real feedback will once a
        // question is answered, so the buttons below don't shift down the
        // first time feedback text appears.
        this.#setFeedback({ mainHtml: '&nbsp;', scoreText: '&nbsp;', placeholder: true });
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
        let mainClass;
        let mainHtml;

        if (selectedOption === null) {
            this.review.push({
                question: currentQuestion.question,
                status: "You didn't know this one",
                correctText
            });
            mainClass = 'dont-know-feedback';
            mainHtml = `<strong>The meaning of "${currentQuestion.question}" is "${correctText}".</strong>`;
        } else if (selectedOption === currentQuestion.correct) {
            this.score++;
            mainClass = 'correct';
            mainHtml = `<strong>Correct.</strong> The meaning of "${currentQuestion.question}" is "${correctText}".`;
        } else {
            this.review.push({
                question: currentQuestion.question,
                status: `You answered "${currentQuestion[selectedOption]}"`,
                correctText
            });
            mainClass = 'incorrect';
            mainHtml = `<strong>Incorrect.</strong> The meaning of "${currentQuestion.question}" is "${correctText}".`;
        }

        this.#setFeedback({
            mainClass,
            mainHtml,
            scoreText: `Your score is ${this.score}/${this.currentIndex + 1}`
        });

        this.currentIndex++;

        // Only checkpoint while there's still a question to resume into;
        // finishing the quiz is handled separately by onComplete.
        if (this.onProgress && this.currentIndex < this.quizData.length) {
            this.onProgress({ currentIndex: this.currentIndex, score: this.score });
        }

        this.#renderQuestion();
    }

    // Builds the two-line feedback block (a main message plus a running
    // score line). Used both for real answer feedback and for the
    // invisible placeholder in resetQuiz(), so the two can never drift out
    // of structural sync with each other.
    #setFeedback({ mainClass = '', mainHtml, scoreText, placeholder = false }) {
        const extraClass = placeholder ? ' feedback-placeholder' : '';
        this.quizElements.feedback.innerHTML =
            `<p class="${mainClass}${extraClass}">${mainHtml}</p>` +
            `<p class="score-tracker${extraClass}">${scoreText}</p>`;
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
