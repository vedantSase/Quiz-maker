//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
// let prevBtn = document.getElementById("prev-button"); // Added for previous functionality
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let scoreCount = 0;
let questionCount = 0;
let countdown;
let fileData = [];

// File input for loading JSON questions
document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            try {
                fileData = JSON.parse(e.target.result); // Convert JSON string to JavaScript object
                quizCreator(fileData);
                console.log("Loaded Questions:", fileData);
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    }
});

// Restart Quiz
restart.addEventListener("click", () => {
    initial();
    displayContainer.classList.remove("hide");
    scoreContainer.classList.add("hide");
});

// Next Button
nextBtn.addEventListener("click", () => {
    if (questionCount < fileData.length - 1) {
        questionCount++;
        alert("Question changed");
        quizDisplay(questionCount);
    } else {
        displayContainer.classList.add("hide");
        scoreContainer.classList.remove("hide");
        userScore.innerHTML = `Your score is ${scoreCount} out of ${fileData.length}`;
    }
});

// Previous Button
// prevBtn.addEventListener("click", () => {
//     if (questionCount > 0) {
//         questionCount--;
//         quizDisplay(questionCount);
//     }
// });

// Timer
const timerDisplay = () => {
    clearInterval(countdown);
    let count = 11;
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count == 0) {
            clearInterval(countdown);
            if (questionCount < fileData.length - 1) {
                questionCount++;
                quizDisplay(questionCount);
            } else {
                displayContainer.classList.add("hide");
                scoreContainer.classList.remove("hide");
                userScore.innerHTML = `Your score is ${scoreCount} out of ${fileData.length}`;
            }
        }
    }, 1000);
};

// Display quiz
const quizDisplay = (questionIndex) => {
    quizContainer.innerHTML = ""; // Clear existing question

    // Display question number
    countOfQuestion.innerHTML = `${questionIndex + 1} of ${fileData.length} Question`;

    // Create question element
    let questionDiv = document.createElement("p");
    questionDiv.classList.add("question");
    questionDiv.innerHTML = fileData[questionIndex].question;
    quizContainer.appendChild(questionDiv);

    // Create options
    fileData[questionIndex].options.forEach((option, index) => {
        let button = document.createElement("button");
        button.classList.add("option-div");
        button.innerText = option;
        button.onclick = () => checker(button, fileData[questionIndex].correct);
        quizContainer.appendChild(button);
    });

    // Reset and start timer
    clearInterval(countdown);
    timerDisplay();
};

// Checker Function to check if option is correct or not
function checker(userOption, correctAnswer) {
    let options = document.querySelectorAll(".option-div");

    // Disable all options
    options.forEach((option) => {
        option.disabled = true;
        if (option.innerText === correctAnswer) {
            option.classList.add("correct");
        } else {
            option.classList.add("incorrect");
        }
    });

    // Update score if correct
    if (userOption.innerText === correctAnswer) {
        scoreCount++;
    }

    // Stop the timer
    clearInterval(countdown);}

// Quiz Creation    
function quizCreator(data) {
    if (data.length > 0) {
        questionCount = 0; // Reset question index
        quizDisplay(questionCount);
        startScreen.classList.add("hide");
        displayContainer.classList.remove("hide");
    } else {
        alert("No questions available in the uploaded file.");
    }
}

// Initial setup
function initial() {
    scoreCount = 0;
    questionCount = 0;
    clearInterval(countdown);
    timerDisplay();
    quizDisplay(questionCount);
}

// When user clicks on start button
startButton.addEventListener("click", () => {
    if (fileData.length > 0) {
        startScreen.classList.add("hide");
        displayContainer.classList.remove("hide");
        initial();
    } else {
        alert("Please upload a JSON file with questions before starting the quiz.");
    }
});

// Hide quiz and display start screen on load
window.onload = () => {
    startScreen.classList.remove("hide");
    displayContainer.classList.add("hide");
};
