// script.js

// DOM Elements
const startBtn = document.getElementById('startBtn');
const questionContainer = document.getElementById('questionContainer');
const questionTitle = document.getElementById('questionTitle');
const answerChoices = document.getElementById('answerChoices');
const quizEnd = document.getElementById('quizEnd');
const finalScore = document.getElementById('finalScore');
const userInitials = document.getElementById('userInitials');
const scoreForm = document.getElementById('scoreForm');
const timeLeft = document.getElementById('timeLeft');
// DOM Elements for high scores
const highScoresButton = document.getElementById('viewHighScores');
const goBackButton = document.getElementById('goBackBtn');
const clearScoresButton = document.getElementById('clearScoresBtn');
const highScoresList = document.getElementById('scoreList');
const highScoresSection = document.getElementById('highScores');


// Quiz questions
const questions = [
    {
      question: "A very useful tool used during development and debugging for printing content to the debugger is:",
      answers: [
        { text: "JavaScript", correct: false },
        { text: "terminal/bash", correct: false },
        { text: "for loops", correct: false },
        { text: "console.log", correct: true }
      ]
    },
    {
      question: "String values must be enclosed within ______ when being assigned to variables.",
      answers: [
        { text: "commas", correct: false },
        { text: "curly brackets", correct: false },
        { text: "quotes", correct: true },
        { text: "parenthesis", correct: false }
      ]
    },
    {
      question: "Arrays in JavaScript can be used to store ______.",
      answers: [
        { text: "numbers and strings", correct: false },
        { text: "other arrays", correct: false },
        { text: "booleans", correct: false },
        { text: "all of the above", correct: true }
      ]
    },
    {
      question: "Commonly used data types DO Not Include:",
      answers: [
        { text: "strings", correct: false },
        { text: "booleans", correct: false },
        { text: "alerts", correct: true },
        { text: "numbers", correct: false }
      ]
    },
    {
      question: "The condition in an if / else statement is enclosed with ______.",
      answers: [
        { text: "quotes", correct: false },
        { text: "curly brackets", correct: false },
        { text: "parenthesis", correct: true },
        { text: "square brackets", correct: false }
      ]
    },
    // Add more questions as needed
  ];
  

let currentQuestionIndex, timerId;

// Start the quiz
startBtn.addEventListener('click', startQuiz);

function startQuiz() {
    startBtn.classList.add('hidden');
    currentQuestionIndex = 0;
    questionContainer.classList.remove('hidden');
    timer = questions.length * 15; // Total time based on the number of questions
    timeLeft.textContent = timer;
    timerId = setInterval(updateTimer, 1000); // Start the timer
    setNextQuestion();
}



// Update the timer and display it
function updateTimer() {
    timer--; // Decrement the timer by one second
    if (timer <= 0) {
        timer = 0; // Ensure the timer does not go below zero
        endQuiz(); // Call endQuiz function to handle the end of the quiz
    }
    timeLeft.textContent = timer; // Update the display with the new timer value
}



// Show the next question
function setNextQuestion() {
    showQuestion(questions[currentQuestionIndex]);
}

// Show current question
function showQuestion(question) {
    questionTitle.textContent = question.question;
    answerChoices.innerHTML = '';
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        button.dataset.correct = answer.correct;
        button.addEventListener('click', selectAnswer);
        answerChoices.appendChild(button);
    });
}

// Select an answer
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    if (correct !== 'true') {
        timer -= 10; // Subtract time if the answer is incorrect
        if (timer < 0) timer = 0; // Prevents the timer from going negative
    }
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        setNextQuestion();
    } else {
        endQuiz();
    }
}

// End the quiz
function endQuiz() {
    clearInterval(timerId); // Stops the timer
    questionContainer.classList.add('hidden'); // Hide questions
    quizEnd.classList.remove('hidden'); // Show the end of quiz section
    finalScore.textContent = timer; // Display final score
}
// Implementing displayHighScores function
function displayHighScores() {
    // Retrieve scores from local storage or set to an empty array if none found
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];

    // Get the high scores list element
    const highScoresList = document.getElementById('scoreList');
    
    // Sort scores in descending order
    highScores.sort((a, b) => b.score - a.score);

    // Create list items for each score
    highScoresList.innerHTML = highScores
        .map(score => `<li>${score.initials} - ${score.score}</li>`)
        .join('');

    // Display the high scores and hide the quiz end section
    highScoresSection.classList.remove('hidden');
    quizEnd.classList.add('hidden'); // Hide the quiz end section

    // Make sure buttons are visible
    document.getElementById('goBackBtn').classList.remove('hidden');
    document.getElementById('clearScoresBtn').classList.remove('hidden');

    // Hide the "View high scores" link and "Time left" in the header
    document.getElementById('viewHighScores').classList.add('hidden');
    document.getElementById('timer').classList.add('hidden');

    // Hide the "Quiz Completed" section
    document.getElementById('quizEnd').classList.add('hidden');
}

// Handle high score submission
function saveHighScore(e) {
    e.preventDefault();

    // Verifica si este puntaje ya se ha intentado guardar
    if (window.scoreSaved) return;
    window.scoreSaved = true; // Establece una bandera para prevenir futuras ejecuciones

    const initials = userInitials.value.trim();
    if (!initials) {
        alert('Initials cannot be empty.');
        window.scoreSaved = false; // Restablece la bandera si el intento no fue válido
        return;
    }

    const newScore = { score: timer, initials: initials };
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    highScores.push(newScore);
    highScores.sort((a, b) => b.score - a.score);
    localStorage.setItem('highScores', JSON.stringify(highScores));
    displayHighScores();
}

document.addEventListener('DOMContentLoaded', (e) => {
    // Tu código para añadir manejadores de eventos aquí
    document.getElementById('viewHighScores').addEventListener('click', (e) => {
        e.preventDefault();
        displayHighScores();
    });
});

// Handling clicks on the "Go Back" button
document.getElementById('goBackBtn').addEventListener('click', function() {
    // Reload the page to reset the state
    window.location.reload();
});

// Listen for submit event on score form
scoreForm.addEventListener('submit', saveHighScore);

// Handling clicks on the "Clear High Scores" button
document.getElementById('clearScoresBtn').addEventListener('click', () => {
    // Clear the high scores from local storage and update the display
    localStorage.removeItem('highScores');
    displayHighScores();
});




// Function to load and display high scores from localStorage
function loadHighScores() {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
    const highScoresList = document.getElementById('scoreList');
    highScoresList.innerHTML = ''; // Clear existing list

    highScores.forEach((score, index) => {
        const scoreItem = document.createElement('li');
        scoreItem.textContent = `${index + 1}. ${score.initials} - ${score.score}`;
        highScoresList.appendChild(scoreItem);
    });
}



// Function to clear high scores from localStorage and the screen
function clearHighScores() {
    localStorage.removeItem('highScores');
    loadHighScores(); // Refresh the list on the screen
}

// Function to reset the quiz to its initial state
function resetQuiz() {
    timer = 0;
    questionContainer.classList.add('hidden');
    quizEnd.classList.add('hidden');
    startBtn.classList.remove('hidden');
}

// Function to go back to the quiz introduction
goBackButton.addEventListener('click', () => {
    highScoresSection.classList.add('hidden');
    resetQuiz();
});

// Function to clear high scores when the button is clicked
clearScoresButton.addEventListener('click', clearHighScores);

// Function to display high scores
highScoresButton.addEventListener('click', () => {
    highScoresSection.classList.remove('hidden');
    questionContainer.classList.add('hidden');
    quizEnd.classList.add('hidden');
    loadHighScores();
});

// Ensure high scores are hidden on quiz start
startBtn.addEventListener('click', () => {
    highScoresSection.classList.add('hidden');
});



// After submitting the high score, load and show the high scores screen
scoreForm.addEventListener('submit', (e) => {
    saveHighScore(e);
    loadHighScores();
    highScoresSection.classList.remove('hidden');
    quizEnd.classList.add('hidden');
});

// Call loadHighScores when the page loads to display any saved scores
document.addEventListener('DOMContentLoaded', loadHighScores);

let isSubmitHandlerAdded = false;

document.addEventListener('DOMContentLoaded', () => {
    if (!isSubmitHandlerAdded) {
        scoreForm.addEventListener('submit', saveHighScore);
        isSubmitHandlerAdded = true;
    }
});

document.getElementById('viewHighScores').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('highScores').classList.remove('hidden');
    document.getElementById('quizIntro').classList.add('hidden'); 
    
});


document.addEventListener('DOMContentLoaded', function() {
    // Check if the Start Quiz button exists before adding the event listener
    const startButton = document.getElementById('startBtn');
    if (startButton) {
        startButton.addEventListener('click', function() {
            // Hide the quiz description div when the Start Quiz button is clicked
            const quizDescription = document.getElementById('quizDescription');
            if (quizDescription) {
                quizDescription.classList.add('hidden');
            }
            // Ensure the quiz content is shown (if it's hidden by default)
            const mainContent = document.getElementById('mainContent');
            if (mainContent) {
                mainContent.classList.remove('hidden');
            }
            // Start the quiz functionality
            startQuiz();
        });
    }
});
