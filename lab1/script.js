function checkAnswer(questionNumber, correctAnswer) {
    var radios = document.getElementsByName('question' + questionNumber); // Get all radio buttons under the question being checked
    var selectedAnswer = '';
    // loop through all radio buttons to get the selected one
    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            selectedAnswer = radios[i].value;
            break;
        }
    }

    // Compare the answers
    if (selectedAnswer === correctAnswer) {
        alert('Correct!');
    } else {
        alert('Wrong answer. Try again!');
    }
}