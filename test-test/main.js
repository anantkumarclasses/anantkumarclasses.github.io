const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybArZyKRT_yCtZWPKPmVaTylDEVTRcDyHNh1ZoEvaUtYuKRvORpFD5c5iCSQXWj0Ktog/exec';

let CORRECT_ANSWERS = {};
let questionNames = [];
let timerInterval;
let timeLimit = 30 * 60; // 30 minutes in seconds
let skipValidation = true;

document.addEventListener("DOMContentLoaded", () => {
  fetch("questions.json")
    .then((res) => res.json())
    .then((questions) => {
      const container = document.getElementById("questionContainer");
      questions.forEach((q, index) => {
        questionNames.push(q.name);
        const questionDiv = document.createElement("div");
        questionDiv.classList.add("question");

        const questionTitle = document.createElement("p");
        questionTitle.innerHTML = `<strong>Q${index + 1}.</strong> ${q.question}`;
        questionDiv.appendChild(questionTitle);

        q.options.forEach((option, i) => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="radio" name="${q.name}" value="${option}"> ${option}`;
          questionDiv.appendChild(label);
          questionDiv.appendChild(document.createElement("br"));
        });

        container.appendChild(questionDiv);
      });

      if (window.MathJax) MathJax.typesetPromise();
      updateProgress();
      startTimer(timeLimit);
    });

  const form = document.getElementById("quizForm");
  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      if (window.quizSubmitted) return;
      window.quizSubmitted = true;

      const formData = new FormData();

      // Validation if not auto-submitted
      if (!skipValidation) {
        const unanswered = questionNames.filter(q => !document.querySelector(`input[name="${q}"]:checked`));
        if (unanswered.length > 0) {
          showError(`Please answer all questions. Missing: ${unanswered.map((q, i) => i + 1).join(', ')}`);
          window.quizSubmitted = false;
          return;
        }
      }

      questionNames.forEach(q => {
        const answer = document.querySelector(`input[name="${q}"]:checked`);
        formData.append(q, answer ? answer.value : '');
      });

      formData.append("timeLeft", document.getElementById("timer")?.textContent || '');

      try {
        const response = await fetch(SCRIPT_URL, {
          method: "POST",
          body: formData,
        });

        const result = await response.json();
        showResult(result);
        form.style.display = "none";
      } catch (error) {
        showError("Something went wrong! Try again.");
        console.error("Submission error:", error);
        window.quizSubmitted = false;
      }
    });
  }
});

function showResult(result) {
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `<h2>Your Score: ${result.score}</h2>`;

  if (result.correctAnswers) {
    CORRECT_ANSWERS = result.correctAnswers;
    showFeedback(result.answers);
  }

  resultContainer.style.display = "block";

  if (window.MathJax) MathJax.typesetPromise();
}

function showFeedback(userAnswers) {
  questionNames.forEach((qName, index) => {
    const correct = CORRECT_ANSWERS[qName];
    const userAnswer = userAnswers[qName];

    const labels = document.querySelectorAll(`input[name="${qName}"]`);
    labels.forEach((input) => {
      const label = input.parentElement;
      if (input.value === correct) {
        label.classList.add("correct");
      } else if (input.value === userAnswer) {
        label.classList.add("wrong");
      }
    });

    if (!userAnswer) {
      labels.forEach(input => {
        if (input.value === correct) {
          input.parentElement.classList.add("missed");
        }
      });
    }
  });
}

function showError(message) {
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = `<p style="color: red;">${message}</p>`;
  resultContainer.style.display = "block";
}

function updateProgress() {
  const inputs = document.querySelectorAll('input[type="radio"]');
  const progressBar = document.getElementById("progressBar");
  if (!progressBar) return;

  const total = questionNames.length;
  let answered = 0;
  questionNames.forEach(q => {
    if (document.querySelector(`input[name="${q}"]:checked`)) answered++;
  });

  const percent = (answered / total) * 100;
  progressBar.style.width = percent + "%";
  progressBar.textContent = `${Math.round(percent)}%`;
}

document.addEventListener("change", updateProgress);

function startTimer(duration) {
  let remaining = duration;
  const timerDisplay = document.getElementById("timer");

  timerInterval = setInterval(() => {
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining % 60;
    timerDisplay.textContent = `Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    if (remaining <= 120) {
      timerDisplay.parentElement.classList.add('warning');
    } else {
      timerDisplay.parentElement.classList.remove('warning');
    }


    if (--remaining < 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "Time's up!";
      autoSubmitQuiz();
    }
  }, 1000);
}

function autoSubmitQuiz() {
  skipValidation = true;
  const form = document.getElementById("quizForm");
  if (form) {
    form.requestSubmit();
  }
}

