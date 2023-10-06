const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const option_list = document.querySelector(".option_list");
const timeCount = quiz_box.querySelector(".timer .timer_sec");
const timeLine = quiz_box.querySelector("header .time_line");
const timeOff = quiz_box.querySelector("header .time_text");

// start quiz button click
start_btn.onclick = () => {
  info_box.classList.add("activeInfo"); // show rules box
};

// exit button click
exit_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); // hide rules box
};

// exit button click
continue_btn.onclick = () => {
  info_box.classList.remove("activeInfo"); // hide rules box
  quiz_box.classList.add("activeQuiz"); // show quiz box
  showQuestions(0);
  questionCounter(1);
  startTimer(15);
  startTimerLine(0);
};

let question_count = 0;
let question_num = 1;
let counter;
let counterLine;
let timeValue = 15;
let timerWidthValue = 0;
let userScore = 0;

// next button to go to next question
const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// quit quiz
quit_quiz.onclick = () => {
  window.location.reload();
};

// restart quiz
restart_quiz.onclick = () => {
  quiz_box.classList.add("activeQuiz");
  result_box.classList.remove("activeResult");
  question_count = 0;
  question_num = 1;
  timeValue = 15;
  timerWidthValue = 0;
  userScore = 0;
  showQuestions(question_count);
  questionCounter(question_num);
  clearInterval(counter);
  startTimer(timeValue);
  clearInterval(counterLine);
  startTimerLine(timerWidthValue);
  next_btn.style.display = "none";
  timeOff.textContent = "Time Left";
};

next_btn.onclick = () => {
  if (question_count < questions.length - 1) {
    question_count++;
    question_num++;
    showQuestions(question_count);
    questionCounter(question_num);
    clearInterval(counter);
    startTimer(timeValue);
    clearInterval(counterLine);
    startTimerLine(timerWidthValue);
    next_btn.style.display = "none";
    timeOff.textContent = "Time Left";
  } else {
    clearInterval(counter);
    clearInterval(counterLine);
    console.log("questions completed");
    showResultBox();
  }
};

// show correct question and change when next is clicked
function showQuestions(index) {
  const question_text = document.querySelector(".que_text");
  let question_tag =
    "<span>" +
    questions[index].num +
    ". " +
    questions[index].question +
    "</span>";
  let option_tag =
    '<div class="option"><span>' +
    questions[index].options[0] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[1] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[2] +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].options[3] +
    "</span></div>";
  question_text.innerHTML = question_tag;
  option_list.innerHTML = option_tag;
  const option = option_list.querySelectorAll(".option");

  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}

let tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// to check if answer is wrong or right
function optionSelected(answer) {
  clearInterval(counter);
  clearInterval(counterLine);
  let userAns = answer.textContent;
  let correctAns = questions[question_count].answer;
  let allOptions = option_list.children.length;
  if (userAns == correctAns) {
    answer.classList.add("correct");
    answer.insertAdjacentHTML("beforeend", tickIcon);
    console.log("Answer is correct!");
    next_btn.style.display = "block";
    userScore++;
  } else {
    answer.classList.add("incorrect");
    answer.insertAdjacentHTML("beforeend", crossIcon);
    next_btn.style.display = "block";
    console.log("Answer is wrong");
    for (let i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correctAns) {
        option_list.children[i].setAttribute("class", "option correct");
        option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
      }
    }
  }

  // disable all options when user picks one
  for (let i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled");
  }
  next_btn.style.display = "block";
}

// view result on completion
function showResultBox() {
  info_box.classList.remove("activeInfo");
  quiz_box.classList.remove("activeQuiz");
  result_box.classList.add("activeResult");
  const scoreText = result_box.querySelector(".score_text");

  let scoreTag;
  if (userScore > 3) {
    scoreTag =
      "<span>Congrats! You got <p>" +
      userScore +
      "</p>out of<p>" +
      questions.length +
      "</p> correct</span>";
  } else if (userScore > 1) {
    scoreTag =
      "<span>Sorry! You got <p>" +
      userScore +
      "</p>out of<p>" +
      questions.length +
      "</p> correct</span>";
  } else {
    scoreTag =
      "<span>Poor! You got <p>" +
      userScore +
      "</p>out of<p>" +
      questions.length +
      "</p> correct</span>";
  }
  scoreText.innerHTML = scoreTag;
}

// function to start the timer
function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer() {
    time--;
    if (time <= 9) {
      timeCount.textContent = "0" + time;
    } else {
      timeCount.textContent = time;
    }
    if (time <= 0) {
      clearInterval(counter);
      timeCount.textContent = "00";
      timeOff.textContent = "Time Out";

      let correctAns = questions[question_count].answer;
      let allOptions = option_list.children.length;

      for (let i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correctAns) {
          option_list.children[i].setAttribute("class", "option correct");
          option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
        }
      }

      for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
      }
      next_btn.style.display = "block";
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 29);
  function timer() {
    time += 1;
    timeLine.style.width = time + "px";
    if (time > 549) {
      clearInterval(counterLine);
    }
  }
}

// show current question number at footer
function questionCounter(index) {
  const question_counter = quiz_box.querySelector(".total_que");
  let totalQuestionCountTag =
    "<span><p>" +
    index +
    "</p>of<p>" +
    questions.length +
    "</p>Questions</span>";
  question_counter.innerHTML = totalQuestionCountTag;
}
