// Replace this URL with your Google Apps Script web app URL
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbybArZyKRT_yCtZWPKPmVaTylDEVTRcDyHNh1ZoEvaUtYuKRvORpFD5c5iCSQXWj0Ktog/exec';
       
        
        document.addEventListener("DOMContentLoaded", () => {
            fetch("questions.json")
            .then((res) => res.json())
            .then((questions) => {
      const container = document.getElementById("questionContainer");
      questions.forEach((q, index) => {
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

        // Add event listeners to radio buttons for progress tracking
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', updateProgress);
        });

        // Form submission
        document.getElementById('quizForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validate that all questions are answered
            const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'q16', 'q17', 'q18', 'q19', 'q20', 'q21', 'q22', 'q23', 'q24'];
            //const unanswered = questions.filter(q => !document.querySelector(`input[name="${q}"]:checked`));
            
            //if (unanswered.length > 0) {
             //   showError(`Please answer all questions. Missing: Question ${unanswered.map(q => q.charAt(1)).join(', ')}`);
             //   return;
           // }

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
                
                questions.forEach(q => {
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
        });

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
