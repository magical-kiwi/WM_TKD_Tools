export function goToMenu() {
    window.location.href = "../../index.html"
}

export function calculateEncouragement(score, total) {
    let encouragement = ''
    let percentCorrect = score/total;
    if(percentCorrect >= 1) encouragement = 'Yay, you got full marks. Well done!';
    else if(percentCorrect >= 0.90) encouragement = 'So close, just a few more tries!';
    else if(percentCorrect >= 0.75) encouragement = 'Almost there, keep at it!';
    else if(percentCorrect >= 0.50) encouragement = 'Half way there, keep practising!';
    else encouragement = 'Keep practising, you get there in no time!';

    return encouragement
}

// Cheap deterministic signature over a question set's text (order,
// question, and correct answer). Used to detect when saved progress or a
// high score was computed against a different question set - e.g. after
// questions are added, removed, reordered or reworded - even when the
// count happens to stay the same. Not cryptographic, just enough to catch
// content drift without relying on anyone remembering to bump a version.
export function contentSignature(questions) {
    const text = questions.map((q) => `${q.question}|${q.correct}`).join('\n');
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = (hash * 31 + text.charCodeAt(i)) | 0;
    }
    return hash;
}
