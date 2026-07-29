// Shows one question at a time with immediate feedback, for quizzes too long
// to comfortably review as a single scrolling page (e.g. the 126-question
// black belt quiz).
export class SequentialQuiz {
    constructor(document, title, questions = []) {
        this.quizData = questions;
        this.title = title;
        this.quizElements = this.#getQuizElements(document);
        this.quizElements.backButton.addEventListener('click', () => {
            this.goBack()
        });
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

    goBack(){
        window.location.href = "../../index.html"
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

        let encouragement = this.#calculateEncouragment(this.score);
        let resultsHtml = `<p><strong>Final Score:</strong><br>You scored ${this.score} out of ${this.quizData.length}. ${encouragement}</p>`;

        if (this.review.length > 0) {
            resultsHtml += `<p><strong>Questions to review:</strong></p>`;
            this.review.forEach((item) => {
                resultsHtml += `<p><strong>${item.question}:</strong> ${item.status}. Correct answer: <u>${item.correctText}</u></p>`;
            });
        }

        quizElements.results.innerHTML = resultsHtml;
    }

    #calculateEncouragment(score){
        let encouragement = ''
        let percentCorrect = score/this.quizData.length;
        if(percentCorrect >= 1) encouragement = 'Yay, you got full marks. Well done!';
        else if(percentCorrect >= 0.90) encouragement = 'So close, just a few more tries!';
        else if(percentCorrect >= 0.75) encouragement = 'Almost there, keep at it!';
        else if(percentCorrect >= 0.50) encouragement = 'Half way there, keep practising!';
        else encouragement = 'Keep practising, you get there in no time!';

        return encouragement
    }
}