// Replace this URL with your Google Apps Script web app URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybArZyKRT_yCtZWPKPmVaTylDEVTRcDyHNh1ZoEvaUtYuKRvORpFD5c5iCSQXWj0Ktog/exec';
       
        let questionNames = [];
        let timerInterval;
        let timeLimit = 5 * 60; // 10 minutes in seconds

        document.addEventListener("DOMContentLoaded", () => {
            fetch("questions.json")
            .then((res) => res.json())
            .then((questions) => {
      const container = document.getElementById("questionContainer");
      questions.forEach((q, index) => {
        questionNames.push(q.name);
        const div = document.createElement("div");
        div.className = "question";
        const heading = document.createElement("h3");
        heading.textContent = `${index + 1}. ${q.question}`;
        div.appendChild(heading);
        
        if (q.questionImage) {
          const img = document.createElement("img");
          img.src = q.questionImage;
          img.alt = `Question ${index + 1} image`;
          img.style.maxWidth = '100%';
          img.style.marginBottom = '10px';
          div.appendChild(img);
         }

        q.options.forEach((opt) => {
          const optionDiv = document.createElement("div");
          optionDiv.className = "option";

          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "radio";
          input.name = q.name;
          input.value = opt.value;

          const span = document.createElement("span");
          span.innerHTML = opt.text;
          //span.textContent = opt.text;

          label.appendChild(input);
          label.appendChild(span);
          if (opt.image) {
             const img = document.createElement("img");
             img.src = opt.image;
             img.alt = `Option image`;
             img.style.display = 'block';
             img.style.maxWidth = '100%';
             img.style.marginTop = '5px';
             label.appendChild(img);
           } 
          
          optionDiv.appendChild(label);
          div.appendChild(optionDiv);
        });

        container.appendChild(div);
      });
      if (window.MathJax) MathJax.typesetPromise(); 
      document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', updateProgress);
    });
     updateProgress();
     startTimer(timeLimit);
    })
    .catch((err) => {
      console.error("Failed to load quiz questions:", err);
      document.getElementById("errorMsg").textContent =
        "Failed to load quiz questions.";
      document.getElementById("errorMsg").style.display = "block";
    });
    });
        
        // Progress tracking
        function updateProgress() {
            const totalQuestions = document.querySelectorAll('.question').length;
            const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
            const progress = (answeredQuestions / totalQuestions) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
        }
        
        function startTimer(duration) {
           let remaining = duration;
           const timerDisplay = document.getElementById("timer");
           
           timerInterval = setInterval(() => {
                const minutes = Math.floor(remaining / 60);
                const seconds = remaining % 60;
                timerDisplay.textContent = `Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;

                if (remaining <= 60) {
                  timerDisplay.parentElement.classList.add('warning');
                } else {
                  timerDisplay.parentElement.classList.remove('warning');
                }

                if (--remaining < 0) {
                     clearInterval(timerInterval);
                     timerDisplay.textContent = "⏰ Time's up!";
                     timerDisplay.parentElement.classList.remove('warning');
                     handleQuizSubmission(true);
                }
           }, 1000);
        }
        
        // Add event listeners to radio buttons for progress tracking
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', updateProgress);
        });

        // Form submission
        function handleQuizSubmission(fromTimer = false) {
           const submitBtn = document.getElementById('submitBtn');

           if (submitBtn.disabled) return; // prevent double submissions

           // Ask for confirmation only if not auto-submitting
           if (!fromTimer) {
              const confirmed = confirm("Are you sure you want to submit your responses?");
              if (!confirmed) return;
            }

            // Disable button to prevent multiple submissions
            submitBtn.disabled = true;
            submitBtn.style.display = "none"; // Hide the button after submission

            // Disable all form inputs
            const inputs = document.querySelectorAll('input[type="radio"]');
            inputs.forEach(input => input.disabled = true);

            // Proceed to submit
            //alert("Submitting your quiz...");
            submitQuizForm();
         }

               
        async function submitQuizForm() {


            // Show loading state
            document.getElementById('submitBtn').disabled = true;
            document.getElementById('loading').style.display = 'block';
            document.getElementById('errorMsg').style.display = 'none';
            document.getElementById('result').classList.remove('show');

            try {
                // Collect form data
                const formData = new FormData();
                formData.append('studentName', document.getElementById('studentName').value);
                formData.append('studentEmail', document.getElementById('studentEmail').value);
                
                questionNames.forEach(q => {
                    const answer = document.querySelector(`input[name="${q}"]:checked`);
                    formData.append(q, answer ? answer.value : '');
                });

                // Submit to Google Apps Script
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json();

                if (result.success === true) {
                     showResult(result.score, result.totalQuestions, result.message, result.correctAnswers);
                } else if (result.error && result.error === "Duplicate submission detected.") {
                   showError("🚫 You can only attempt the quiz once. If you think this is a mistake, contact the instructor.");
                   return;
                } else {
                     console.error("Unexpected response:", result);
                     throw new Error('Unknown error occurred');
               }


            } catch (error) {
                console.error('Error:', error);
                showError('Failed to submit quiz. Please check your internet connection and try again.');
            } finally {
                // Hide loading state
                document.getElementById('loading').style.display = 'none';
                document.getElementById('submitBtn').disabled = false;
            }
        }
        
        function showResult(score, total, message, correctAnswers) {
            const percentage = Math.round((score / (3* total)) * 100);
            const full_marks = 3 * total;
            document.getElementById('scoreDisplay').textContent = `${score}/${full_marks} (${percentage}%)`;
            document.getElementById('resultMessage').textContent = message || getScoreMessage(percentage);
            document.getElementById('result').classList.add('show');
            if (correctAnswers) showFeedback(correctAnswers);
        }
        
        function showFeedback(correctAnswers) {
            Object.keys(correctAnswers).forEach(qname => {
            const correctValue = correctAnswers[qname];
            const selectedInput = document.querySelector(`input[name="${qname}"]:checked`);
            const inputs = document.querySelectorAll(`input[name="${qname}"]`);

            inputs.forEach(input => {
               const parentLabel = input.closest("label");
               if (!parentLabel) return;

              // Remove previous feedback classes
              parentLabel.classList.remove("correct", "wrong", "missed");

              if (input.value === correctValue) {
                parentLabel.classList.add("correct");
              } 
              if (selectedInput && input === selectedInput && input.value !== correctValue) {
                parentLabel.classList.add("wrong");
              }
              if (!selectedInput && input.value === correctValue) {
                parentLabel.classList.add("missed");
              }

           // Optionally disable all after submission
           input.disabled = true;
           });
           });
        }


        function showError(message) {
            const errorDiv = document.getElementById('errorMsg');
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 5000);
        }

        function getScoreMessage(percentage) {
            if (percentage >= 90) return '🎉 Excellent work! Outstanding performance!';
            if (percentage >= 80) return '👏 Great job! You did very well!';
            if (percentage >= 70) return '👍 Good work! Keep it up!';
            if (percentage >= 60) return '📚 Not bad! There\'s room for improvement.';
            return '💪 Keep studying and try again!';
        }

        // Initialize progress
        updateProgress();
