let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let msg = document.getElementById("message");
let roundTitle = document.getElementById("roundTitle");

let category = document.getElementById("category");
let startRoundBtn = document.getElementById("startRoundBtn");
let categoryMessage = document.getElementById("categoryMessage");

//questions screeen
let turn = document.getElementById("turn");
let difficulty = document.getElementById("difficulty");
let questionText = document.getElementById("questionText");

let option = document.getElementById("options");
let opt1 = document.getElementById("opt1");
let opt2 = document.getElementById("opt2");
let opt3 = document.getElementById("opt3");
let opt4 = document.getElementById("opt4");

let opt1Text = document.getElementById("opt1Text");
let opt2Text = document.getElementById("opt2Text");
let opt3Text = document.getElementById("opt3Text");
let opt4Text = document.getElementById("opt4Text");

let nextBtn = document.getElementById("nextBtn");
let scorePl1 = document.getElementById("scorePl1");
let scorePl2 = document.getElementById("scorePl2");

//summary screen
let nextRound = document.getElementById("nextRound");
let endGameBtn = document.getElementById("endGameBtn");
let usedCategories = [];

function updateCategoryOptions() {
  let options = category.querySelectorAll("option");
  options.forEach(opt => {
    if (usedCategories.includes(opt.value)) {
      opt.disabled = true;
    }
  });
  category.value = "";
}

//final result 
let finalP1 = document.getElementById("finalP1");
let finalP2 = document.getElementById("finalP2");
let winnerMessage = document.getElementById("winnerMessage"); 


//game state
let currentCategory = "";
let round = 1;
let scoreP1 = 0;
let scoreP2 = 0;
let playerFirst = "";
let playerSec = "";
let questions = [];
let currentQuesIndex = 0;
let currentPlayer = 0;

function submitButton() {
  p1 = player1.value.trim();
  p2 = player2.value.trim();
  if (p1 === "" || p2 === "") {
    msg.textContent = "Both fields are required!";
    msg.style.color = "red";
    return;
  }

  if (p1 === p2) {
    msg.textContent = "Players name should be unique";
    msg.style.color = "red";
    return;
  }

  msg.textContent = "";
  showScreen("categoryScreen");
  document.getElementById("scoreAndRound").classList.add("active");
  playerFirst = p1;
  playerSec = p2;
  scorePl1.textContent = `${playerFirst}: 0`;
  scorePl2.textContent = `${playerSec}: 0`;
}

player1.addEventListener("input", clearMessage);
player2.addEventListener("input", clearMessage);

function clearMessage() {
  let p1 = player1.value.trim();
  let p2 = player2.value.trim();
  if (p1 !== "" && p2 !== "") {
    msg.textContent = "";
  }
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
  document.getElementById("scoreAndRound").classList.add("active");
}

//fetching questions
async function fetchQuestions() {
  let selectedCategory = category.value;
  try {
    let easyRes = await fetch(
      `https://the-trivia-api.com/v2/questions?limit=2&categories=${selectedCategory}&difficulties=easy`,
    );
    let easyQues = await easyRes.json();
    let mediumRes = await fetch(
      `https://the-trivia-api.com/v2/questions?limit=2&categories=${selectedCategory}&difficulties=medium`,
    );
    let mediumQues = await mediumRes.json();
    let hardRes = await fetch(
      `https://the-trivia-api.com/v2/questions?limit=2&categories=${selectedCategory}&difficulties=hard`,
    );
    let hardQues = await hardRes.json();
    let allQues = [...easyQues, ...mediumQues, ...hardQues];
    return allQues;
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

//adding eventlistener to round submit button
startRoundBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  currentCategory = category.value;
  questions = await fetchQuestions();
  usedCategories.push(currentCategory);
  currentQuesIndex = 0;
  currentPlayer = 1;
  showScreen("questionScreen");
  showQuestion(questions);
});


function showQuestion(ques) {
  let q = ques[currentQuesIndex];
  turn.textContent =
    currentQuesIndex % 2 === 0
      ? `${playerFirst}'s Turn`
      : `${playerSec}'s Turn`;
  questionText.textContent = `${currentQuesIndex + 1}. ${q.question.text}`;
  difficulty.textContent = `Difficulty: ${q.difficulty}`;
  let opts = [q.correctAnswer, ...q.incorrectAnswers];
  opts.sort(() => Math.random() - 0.5);
  opt1Text.textContent = opts[0];
  opt2Text.textContent = opts[1];
  opt3Text.textContent = opts[2];
  opt4Text.textContent = opts[3];

  opt1.value = opts[0];
  opt2.value = opts[1];
  opt3.value = opts[2];
  opt4.value = opts[3];

  document.querySelectorAll('input[name="answer"]').forEach((r) => {
    r.checked = false;
    r.disabled = false;
  });
  nextBtn.disabled = true;
}

// function to update score
function scoreUpdate(d, scoreP) {
  if (d === "easy") {
    return scoreP + 10;
  } else if (d === "medium") {
    return scoreP + 15;
  } else if (d === "hard") {
    return scoreP + 20;
  }
  return scoreP;
}

option.addEventListener("change", function (e) {
  let selectedAnswer = e.target.value;
  let correctAnswer = questions[currentQuesIndex].correctAnswer;
  let qDifficulty = questions[currentQuesIndex].difficulty;
  document.querySelectorAll('input[name="answer"]').forEach((radio) => {
    radio.disabled = true;
    if (radio.value === correctAnswer) {
      radio.nextElementSibling.style.color = "green";
    }

    if (radio === e.target && radio.value !== correctAnswer) {
      radio.nextElementSibling.style.color = "red";
    }
  });

  // score update
  if (selectedAnswer === correctAnswer) {
    if (currentQuesIndex % 2 === 0) {
      scoreP1 = scoreUpdate(qDifficulty, scoreP1);
      scorePl1.textContent = `${playerFirst}: ${scoreP1}`;
    } else {
      scoreP2 = scoreUpdate(qDifficulty, scoreP2);
      scorePl2.textContent = `${playerSec}: ${scoreP2}`;
    }
  }
  nextBtn.disabled = false;
});

nextBtn.addEventListener("click", function () {
  document.querySelectorAll("#options span").forEach((span) => {
    span.style.color = "black";
  });
  currentQuesIndex++;

  if (currentQuesIndex < questions.length) {
    showQuestion(questions);
  }
  else {
    showScreen("summaryScreen");
    document.getElementById("summaryP1").textContent = `${playerFirst} Score: ${scoreP1}`;
    document.getElementById("summaryP2").textContent = `${playerSec} Score: ${scoreP2}`;
  }
});


//summary screen buttons 
nextRound.addEventListener("click", function () {
  let remainingCategories = [...category.options]
    .filter(opt => opt.value && !opt.disabled);

  if (remainingCategories.length === 0) {
    nextRound.disabled = true;
    return;
  }

  round++;
  roundTitle.textContent = `Round ${round}`;
  updateCategoryOptions();
  showScreen("categoryScreen");
});

//end game button 
endGameBtn.addEventListener("click", ()=>{
    finalP1.textContent = `${playerFirst} Score: ${scoreP1}`;
    finalP2.textContent = `${playerSec} Score: ${scoreP2}`;
    if (scoreP1 === scoreP2) {
      winnerMessage.textContent = `Match Draw` ;
    }
    else if (scoreP1 > scoreP2){
      winnerMessage.textContent = `Winner is ${playerFirst}` ;
    }
    else{
      winnerMessage.textContent = `Winner is ${playerSec}` ;
    }
    document.getElementById("scoreAndRound").style.display = "none";
    showScreen("finalScreen");
})