function checkAnswer(questionNumber, correctAnswer) {
    var radios = document.getElementsByName('question' + questionNumber);
    var selectedAnswer = '';
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedAnswer = radios[i].value;
            break;
        }
    }

    if (selectedAnswer === correctAnswer) {
        alert('Correct!');
    } else {
        alert('Wrong answer. Try again!');
    }
}