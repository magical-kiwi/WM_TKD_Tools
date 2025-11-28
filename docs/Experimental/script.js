class TranslationElement {
    constructor(inEng, inKor) {
        this.eng = inEng;
        this.kor = inKor;
    }
}

function CombineWithSpace(a, b) {
    return a+ " " + b;
};

function CombineWithSpaceEng(a, b){
    return CombineWithSpace(a.eng, b.eng)
}

function CombineWithSpaceKor(a, b){
    return CombineWithSpace(a.kor, b.kor)
}


document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable');
    const dropSlots = document.querySelectorAll('.drop-slot');
    const checkButton = document.getElementById('check-answer');
    const nextButton = document.getElementById('next-question');
    const result = document.getElementById('result');
    const questionText = document.querySelector('p strong');

    let Ha_Dan = new TranslationElement("Low", "Ha Dan");
    let Mahk_Ki = new TranslationElement("Block", "Mahk Ki");
    let Sang_Dan = new TranslationElement("High", "Sang_Dan");

    // Initial question setup
    let currentQuestionIndex = 0;
    const questions = [
        {
            question: CombineWithSpaceEng(Ha_Dan, Mahk_Ki),
            answer: CombineWithSpaceKor(Ha_Dan, Mahk_Ki),
            draggables: [Mahk_Ki.kor, "Choong Dan", Ha_Dan.kor, "Cha Ki"],
        },
        {
            question: CombineWithSpaceEng(Sang_Dan, Mahk_Ki),
            answer: CombineWithSpaceKor(Sang_Dan, Mahk_Ki),
            draggables: ["Chung dan", "Kong Kyuck", Sang_Dan.kor, Mahk_Ki.kor],
        },
    ];

    function setupQuestion(index) {
        const question = questions[index];
        questionText.textContent = question.question;
        result.textContent = '';
        dropSlots.forEach(slot => {
            slot.textContent = '';
            delete slot.dataset.text;
        });

        // Reset draggable items
        const wordBank = document.getElementById('word-bank');
        wordBank.innerHTML = '';
        question.draggables.forEach(word => {
            const wordBox = document.createElement('div');
            wordBox.className = 'draggable';
            wordBox.draggable = true;
            wordBox.dataset.text = word;
            wordBox.textContent = word;
            wordBank.appendChild(wordBox);

            // Rebind drag event listeners
            wordBox.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text', e.target.dataset.text);
                e.target.classList.add('dragging');
            });

            wordBox.addEventListener('dragend', () => {
                wordBox.classList.remove('dragging');
            });
        });
    }

    // Initialize the first question
    setupQuestion(currentQuestionIndex);

    // Drag and Drop functionality
    dropSlots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        slot.addEventListener('drop', (e) => {
            const text = e.dataTransfer.getData('text');
            e.target.textContent = text;
            e.target.dataset.text = text;
        });
    });

    // Check the answer
    checkButton.addEventListener('click', () => {
        const answer = Array.from(dropSlots).map(slot => slot.dataset.text).join(' ');
        if (answer === questions[currentQuestionIndex].answer) {
            result.textContent = 'Correct! Well done!';
            result.style.color = 'green';
            nextButton.style.display = 'inline-block'; // Show the Next Question button
        } else {
            result.textContent = 'Incorrect. Try again!';
            result.style.color = 'red';
        }
    });

    // Set up the next question
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            setupQuestion(currentQuestionIndex);
            nextButton.style.display = 'none'; // Hide the Next Question button
        } else {
            result.textContent = 'You completed all questions!';
            nextButton.style.display = 'none';
            checkButton.style.display = 'none';
        }
    });
});