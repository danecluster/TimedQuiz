var quesIndex;
var gameTimer;
var timeAllotted = 45; //seconds
var endGameStatus = true;
var score = 0;
var questionBank = [
 {
   question:"Inside which HTML element do we put the JavaScript?",
   answers:[
     {ansID: 1000, answer:"script"},
     {ansID: 1001, answer:"js"},
     {ansID: 1002, answer:"javascript"},
     {ansID: 1003, answer:"scripting"},
   ],
   correct: 1000,
   selected: null,
 },
 {
   question:"Where is the correct place to insert a JavaScript?",
   answers:[
     {ansID: 1003, answer:"Both the head section and the body section are correct"},
     {ansID: 1004, answer:"The head section"},
     {ansID: 1005, answer:"The body section"},
     {ansID: 1006, answer:"None of the above"},
   ],
   correct: 1004,
   selected: null,
 },
 {
   question:"What is the correct syntax for referring to an external script called xxx.js?",
   answers:[
     {ansID: 1007, answer:"script href=xxx.js"},
     {ansID: 1008, answer:"script name=xxx.js"},
     {ansID: 1009, answer:"script src=xxx.js"},
     {ansID: 1010, answer:"None of the above"},
   ],
   correct: 1010,
   selected: null,
 },     
 {
   question:"The external JavaScript file must contain the script tag",
   answers:[
     {ansID: 1011, answer:"False"},
     {ansID: 1012, answer:"True"},
   ],
   correct: 1011,
   selected: null,
 },  
 {
   question: "How do you create a function in JavaScript?",
   answers:[
     {ansID: 1014, answer:"function is myFunction()"},
     {ansID: 1015, answer:"function:myFunction()"},
     {ansID: 1016, answer:"function myFunction()"},
     {ansID: 1017, answer:"function myFunction()"},
   ],
   correct: 1017,
   selected: null,
 },    
];

function populateQuestionDetails() {
  $("#answer-response").hide();
  $("#question-container").empty();
  $("#answers-container").empty();
  $("#answer-response").empty();
  $("#question-container").html(questionBank[quesIndex].question);
  
  var quesAnswers = questionBank[quesIndex].answers;
  
  for (var i=0; i < quesAnswers.length; i++) {
    $("#answers-container").append('<div class="answer" data-content="' + quesAnswers[i].ansID + '">' + quesAnswers[i].answer + '</div>');
  }
  
  renderQuesControls();
}

function renderQuesControls() {
  if (quesIndex === 0) {
    $("#previousQ").hide();
    $("#nextQ").show();
  } else if (quesIndex === questionBank.length-1) {
    $("#previousQ").show();
    $("#nextQ").hide();     
    $("#finish").show();
  } else {
    $("#previousQ").show();
    $("#nextQ").show();    
  }
}

function getPreviousQuestion() {
  quesIndex--;
  populateQuestionDetails();
}

function getNextQuestion() {
  quesIndex++;
  populateQuestionDetails();
}

function processAnswer() {
  var selectedAnsID = parseInt($(this).attr("data-content"));
  var correctAnsID = questionBank[quesIndex].correct;
  
  if (selectedAnsID === correctAnsID) {
      $("#answer-response").html("<h4>Correct!</h4>");
  } else {
      timeAllotted = timeAllotted - 10;
      $("#answer-response").html("<h4>Sorry that's not right.</h4>");
     
  }
  
  $("#answer-response").append(questionBank[quesIndex].reason);
  $("#answer-response").show();
  
  //save the answer the user selected in the questionBank
  questionBank[quesIndex].selected = selectedAnsID;
  
  console.log(questionBank[quesIndex].selected);
}

$(document).ready(function () {
  //pre init routine
  $("#main-game").hide();
  $("#results-display").hide();
  $("#previousQ").hide();
  $("#nextQ").hide();
  $("#finish").hide();
});

function updateClock() {
  timeAllotted--;
  $("#game-timer").html(timeAllotted);
  if (timeAllotted === 0) {
    clearInterval(gameTimer);
    endGame();
  }
}

$("#start").on("click", function () {
  $("#splash-screen").hide();
  $("#main-game").show();

  gameTimer = setInterval(updateClock, 1000);
  
  quesIndex = 0;
  populateQuestionDetails(quesIndex);
});

$(document).on("click", ".answer", processAnswer);

$("#previousQ").on("click", getPreviousQuestion);

$("#nextQ").on("click", getNextQuestion);

$("#finish").on("click", endGame);

function endGame() {
  $("#main-game").hide();
  if (endGameStatus){
    processResults();  
  }
  $("#results-display").show();
  endGameStatus = false;
}

$("#restart").on("click", function () {
  console.log("reload the game.");
  window.location.reload()
});

function processResults() {
  var status;
  var correct = 0;
  var incorrect = 0;
  
  
  questionBank.forEach((question) => {
    if (question.correct === question.selected) {
      correct++;
      status = "Correct!";
    } else {
      incorrect++;
      status = "Incorrect!";
    }
  
    // Get selected text
    const selectedText =
      question.selected !== null
        ? question.answers.find((answer) => answer.ansID === question.selected)?.answer || "NA"
        : "--";
  
    // Get correct ans text
    const correctText =
      question.answers.find((answer) => answer.ansID === question.correct)?.answer || "NA";
  
    $("#result-rows").append(
      `<tr><td>${question.question}</td><td>${selectedText}</td><td>${correctText}</td><td>${status}</td></tr>`
    );
  });  
}
function saveHighScore(){  
  const initials=  $(`input[name="inputBox"]`).val().trim()
  let allScores = JSON.parse(localStorage.getItem("highScore")) || []
  const newScore={
    initials:initials,
    score:score
  }
  allScores.push(newScore)
  localStorage.setItem("highScore" , JSON.stringify(allScores))
  $('#initialsForm').empty()
  }
