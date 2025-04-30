let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let selectedOption = '';
let answered = false;

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

async function loadQuestions() {
  const chapter = getQueryParam("chapter");
  const file = `questions/${chapter}.json`;

  try {
    const response = await fetch(file);
    questions = await response.json();
    showQuestion();
  } catch (err) {
    document.getElementById('question-text').textContent = `Could not load ${file}`;
    console.error(err);
  }
}

function showQuestion() {
  const q = questions[currentQuestionIndex];
  answered = false;

  const qDiv = document.getElementById("question-text");
  qDiv.innerHTML = `${currentQuestionIndex + 1}. ${q.question}`;

  if (q.question_image) {
    const img = document.createElement('img');
    img.src = q.question_image;
    img.alt = 'question image';
    qDiv.appendChild(img);
  }

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  for (const [key, value] of Object.entries(q.options)) {
    const opt = document.createElement('label');
    opt.classList.add('option');

    if (value.endsWith(".png") || value.endsWith(".jpg")) {
      opt.innerHTML = `<input type="radio" name="option" value="${key}"> ${key}. <img src="${value}" alt="Option ${key}">`;
    } else {
      opt.innerHTML = `<input type="radio" name="option" value="${key}"> ${key}. ${value}`;
    }

    optionsDiv.appendChild(opt);
  }

  document.getElementById("prev-btn").classList.toggle("hidden", currentQuestionIndex === 0);
  document.getElementById("submit-btn").classList.remove("hidden");
  document.getElementById("next-btn").classList.remove("hidden");
  document.getElementById("score").classList.add("hidden");
  document.getElementById("restart-btn").classList.add("hidden");

  if (window.MathJax) MathJax.typesetPromise();
}

function checkAnswer() {
  if (answered) return;
  const selected = document.querySelector('input[name="option"]:checked');
  if (!selected) {
    alert("Please select an option before submitting.");
    return;
  }
  answered = true;
  const correct = questions[currentQuestionIndex].answer;
  const chosen = selected.value;

  const all = document.querySelectorAll('input[name="option"]');
  all.forEach(opt => {
    if (opt.value === correct) opt.parentElement.classList.add("correct");
    else if (opt.checked && opt.value !== correct) opt.parentElement.classList.add("incorrect");
    opt.disabled = true;
  });

  if (chosen === correct) score++;
}

function showScore() {
  document.getElementById('question-text').textContent = "Quiz Completed!";
  document.getElementById('options').innerHTML = '';
  document.getElementById('submit-btn').classList.add('hidden');
  document.getElementById('next-btn').classList.add('hidden');
  document.getElementById('prev-btn').classList.add('hidden');
  document.getElementById('score').textContent = `You scored ${score} out of ${questions.length}`;
  document.getElementById('score').classList.remove('hidden');
  document.getElementById('restart-btn').classList.remove('hidden');
}

document.getElementById('submit-btn').addEventListener('click', checkAnswer);
document.getElementById('next-btn').addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) showQuestion();
  else showScore();
});
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    showQuestion();
  }
});
document.getElementById('restart-btn').addEventListener('click', () => {
  currentQuestionIndex = 0;
  score = 0;
  showQuestion();
});

loadQuestions();

