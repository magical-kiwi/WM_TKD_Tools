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
