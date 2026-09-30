import { calculateEncouragement, goToMenu } from './quiz_common.js';

// Renders every question at once as a radio-button form, for the shorter
// (Gup grade) quizzes: White, Green, Brown and Red Belt.
export class GupQuiz {
    constructor(document, title, questions = []) {
        this.quizData = questions;
        this.quizElements = this.#getQuizElements(document);
        this.quizElements.backButton.addEventListener('click', () => {
            goToMenu()
        });
        this.title = title
        this.#initQuiz();
    }

    #getQuizElements(doc) {
        return {
            document: doc,
            title: doc.getElementById("title"),
            quiz: doc.getElementById("quiz"),
            submitButton: doc.getElementById("submit"),
            resetButton: doc.getElementById("reset"),
            backButton: doc.getElementById("back"),
            results: doc.getElementById("results"),
            questionBlocks: []
        };
    }

    #initQuiz() {
        this.quizElements.title.innerHTML = this.title
        this.quizElements.submitButton.addEventListener('click', () => {
            this.submitQuiz()
        });

        this.quizElements.resetButton.addEventListener('click', () => { this.resetQuiz()});
        this.resetQuiz();
    }


    resetQuiz() {
        let quizElements = this.quizElements;
        quizElements.questionBlocks = [];
        quizElements.submitButton.disabled = false;
        quizElements.resetButton.disabled = true;
        quizElements.results.innerHTML = ''
        quizElements.quiz.innerHTML = '';
        this.quizData.forEach((currentQuestion, index) => {
            const questionNumber = index + 1;

            // Create a container for the question
            const questionContainer = document.createElement("div");
            questionContainer.className = "question";

            // Create the question label
            const questionLabel = document.createElement("label");
            questionLabel.id = `${questionNumber}_question`;
            questionLabel.innerHTML = `<strong>Question ${questionNumber}: ${currentQuestion.question}</strong>`;
            questionContainer.appendChild(questionLabel);
            questionContainer.appendChild(document.createElement("br"));

            // Create answer labels and inputs
            ["a", "b", "c"].forEach((option) => {
                const answerLabel = document.createElement("label");
                answerLabel.id = `${questionNumber}_ans_${option}`;
                const input = document.createElement("input");
                input.type = "radio";
                input.name = `answer${index}`;
                input.value = option;
                answerLabel.appendChild(input);
                answerLabel.appendChild(document.createTextNode(` ${currentQuestion[option]}`));
                questionContainer.appendChild(answerLabel);
                questionContainer.appendChild(document.createElement("br"));
            });

            // Create correction label
            const correctionLabel = document.createElement("label");
            correctionLabel.id = `${questionNumber}_correction`;
            questionContainer.appendChild(correctionLabel);

            // Append the question container to the quiz element
            quizElements.quiz.appendChild(questionContainer);

            // Add the question and answers to the questionBlocks array
            quizElements.questionBlocks.push({
                question: questionLabel,
                answerA: document.getElementById(`${questionNumber}_ans_a`).querySelector("input"),
                answerB: document.getElementById(`${questionNumber}_ans_b`).querySelector("input"),
                answerC: document.getElementById(`${questionNumber}_ans_c`).querySelector("input"),
                correction: correctionLabel,
            });
        });
    }

    submitQuiz()
    {
        let incorrectAnswers = []
        let score = 0;
        let quizElements = this.quizElements;
        this.quizData.forEach((currentQuestion, index) => {
            const answer = quizElements.document.querySelector(`input[name="answer${index}"]:checked`);
            let questionBlocks = quizElements.questionBlocks[index];

            questionBlocks.answerA.disabled = true;
            questionBlocks.answerB.disabled = true;
            questionBlocks.answerC.disabled = true;
            // If an answer has been selected.
            if (answer) {
                if(answer.value === currentQuestion.correct) {
                    score++;
                    questionBlocks.question.classList.toggle("correct");
                }
                else{
                    let incorrectText = `<strong>Question ${index + 1}:</strong> Your Answer: <u>${currentQuestion[answer.value]}</u>. Correct answer: <u>${currentQuestion[currentQuestion.correct]}</u>`;
                    incorrectAnswers.push(incorrectText)
                    questionBlocks.correction.innerHTML = incorrectText;
                    questionBlocks.question.classList.toggle("incorrect");
                }
            }
            // No answer has been selected
            else{
                let incorrectText = `<strong>Question ${index + 1}:</strong> You <u>did not answer</u>. The Correct answer: <u>${currentQuestion[currentQuestion.correct]}</u>`;
                incorrectAnswers.push(incorrectText)
                questionBlocks.correction.innerHTML = incorrectText;
                questionBlocks.question.classList.toggle("incorrect");
            }
        });


        this.#setResults(score, incorrectAnswers)

        quizElements.submitButton.disabled = true;
        quizElements.resetButton.disabled = false;
    }

    #setResults(score, incorrectAnswers){
        let quizElements = this.quizElements;

        quizElements.results.innerHTML = ''
        //set Score
        const scoreDiv = document.createElement("div");
        let encouragement = calculateEncouragement(score, this.quizData.length)
        scoreDiv.innerHTML = `<p><strong>Score:</strong><br>You scored ${score} out of ${this.quizData.length}. ${encouragement}</p>`;
        quizElements.results.appendChild(scoreDiv)
        //Set incorrect answers.
        if(incorrectAnswers.length > 0){
            const resultDiv = document.createElement("div");
            quizElements.results.appendChild(resultDiv)
            const resultParagraph = document.createElement("p")
            resultDiv.appendChild(resultParagraph)
            let incorrectAnswersHTML = `<strong>Incorrect Answers:</strong><br>`

            incorrectAnswers.forEach((incorrectAnswer, index) => {
                incorrectAnswersHTML += `${incorrectAnswer}<br>`
            });
            resultParagraph.innerHTML = incorrectAnswersHTML;
        }
    }

}
